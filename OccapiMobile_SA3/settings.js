var settings = {
	cookieName : "OccapiMobileSettings",
	dateFormat : "Y-m-d",
	alias: "VSettings",
	itemId: "VSettings",
    view: null,
    
    /*** settings names ***/
    // this names should match with field names on "Settings view"
    // using setting: 
    //		settings.get(settings.mySetting); // instead of ...
    //		settings.get("mySetting"); //less typos because of Architect type helper
    names: {
        rememberMe: "rememberMe",
        autoLogin: "autoLogin",
        alertsRefreshEnabled: "alertsRefreshEnabled",
        alertsRefreshTimeout: "alertsRefreshTimeout",
        chartRefreshEnabled: "chartRefreshEnabled",
        chartRefreshTimeout: "chartRefreshTimeout",
        apiUrl: "apiUrl"
    },

	getSettingsView : function () {
		if (!settings.view) {
            try {
                settings.view = Ext.Viewport.down("#" + settings.itemId);
            }
            catch (err1) {
                try {
                    settings.view = Ext.widget(settings.alias);
                } catch (err2) {
                    console.error(err);
                    console.log("Settings view not not set properly!");
                    console.log("Settings alias must be set to: '" + settigns.alias + "'!");
                    console.log("Settings itemId must be set to: '" + settigns.itemId + "'!");
                    console.log("settings.view must be set to settings view!");
                    return null;
                }
            }
		}
		return settings.view;
	},

	/*** call this on applicaton launch after "App = this;" ***/
	init : function (view) {
        
        if(view) {
            settings.view = view;
        }
        
		if (!App) {
			App = {};
		}

		App.getSettingsCookie = function () {
			var sc = getCookie(settings.cookieName);
			if (!sc) {
				sc = {};
			} else if (sc == "undefined") {
				sc = {};
			}
			return sc;
		};

		App.setSettingsCookie = function (sc) {
			setCookie(settings.cookieName, sc);
		};

		App.clearSettingsCookie = function () {
			setCookie(settings.cookieName);
		};

		App.getSetting = function (key) {
			var sc = App.getSettingsCookie();
			if (sc) {
				if (sc.appSettings) {
					var sKeys = Ext.Object.getKeys(sc.appSettings);
					if (Ext.Array.contains(sKeys, key)) {
						return sc.appSettings[key];
					}
				}

				settings.getSettingsView();

				var fSett = settings.view.down("[name='" + key + "']");
				if (fSett) {
					var value;
                    
                    if(fSett.xtype == "checkboxfield") {
                        value = fSett.getChecked();
                    }
                    else if(fSett.xtype == "togglefield") {
                        value = fSett.getValue() == 1;
                    } 
                    else {
                        value = fSett.getValue();
                    }
                    
					//console.log("Using default settings from Settings form. [" + key + "] = " + value);
					return value;
				} else {
					console.log("No app setting with name '" + key + "'");
				}
			}
			return null;
		};

		App.getDateSetting = function (key) {
			var sett = App.getSetting(key);
			if (sett) {
				return Ext.Date.parse(sett, settings.dateFormat);
			} else {
				return null;
			}
		};

		App.setSetting = function (key, value) {
			var sc = App.getSettingsCookie();
			if (!sc.appSettings) {
				console.log("No app settings yet. App settings created.");
				sc.appSettings = {};
			}
			sc.appSettings[key] = value;
			App.setSettingsCookie(sc);
		};

		App.setDateSetting = function (key, value) {
			App.setSetting(key, Ext.Date.format(value, settings.dateFormat));
		};
	},
    
    get: function(key) {
		return App.getSetting(key);        
    },
    
    getDate: function(key) {
		return App.getDateSetting(key);        
    },
    
    set: function(key, value) {
		App.setSetting(key, value);        
    },
    
    setDate: function(key, value) {
		App.setDateSetting(key, value);        
    },

	/*** call this on setting field change or on save settings button click ***/
	save : function () {
		settings.view = settings.getSettingsView();

		Ext.Array.each(settings.view.query("field"), function (settField) {
			var key = settField.getName();
			var value = null;

			if (settField.xtype == "checkboxfield") {
				value = settField.getChecked();
			}
            else if(settField.xtype == "togglefield") {
                value = settField.getValue() == 1;
            }
            else if (settField.xtype == "sliderfield") {
                value = settField.getValue()[0];
                            
            }
            else if (settField.xtype == "datepickerfield") {
				if (settField.getValue()) {
					value = Ext.Date.format(settField.getValue(), settings.dateFormat);
				} else {
					value = null;
				}
			} else {
				value = settField.getValue();
			}

			App.setSetting(key, value);
		}, settings);
	},

	/*** call this after showing setting view ***/
	load : function () {
		var me = settings;
		var sc = App.getSettingsCookie();

		me._blockSave = true;

		if (sc.appSettings) {
			Ext.Array.each(Ext.Object.getKeys(sc.appSettings), function (key) {
				var value = sc.appSettings[key];
				var fSett = me.getSettingsView().down("[name='" + key + "']");

				if (fSett) {
					if (fSett.xtype == "checkboxfield") {
                        fSett.setChecked(value);
                    }
                    else if (fSett.xtype == "togglefield") {
                        fSett.setValue(value ? 1 : 0);
                    }
                    else if (fSett.xtype == "sliderfield") {
                        fSett.setValue(value);
                        App.CSettings.sliderfieldValueChange(fSett);
                            
                    } else if (fSett.xtype == "datepickerfield") {
						if (value) {
							fSett.setValue(Ext.Date.parse(value, me.dateFormat));
						} else {
							// setting default dates - today
							fSett.setValue(new Date());
						}
					} else {
						fSett.setValue(value);
					}
				}
			}, me);
		} else {
			console.log("No settings cookie yet.");
		}

		me._blockSave = false;
	},
    
    /*** call this when you want to reset settings to default values ***/
    defaults : function () {
        clearCookie(settings.cookieName);
        console.log("Settings restored to default values");
    }
};

/***** METHODS FOR MANIPULATING COOKIES *****/
var Cookies = {
	set : function (name, value) {
		var argv = arguments;
		var argc = arguments.length;
		var expires = (argc > 2) ? argv[2] : null;
		var path = (argc > 3) ? argv[3] : '/';
		var domain = (argc > 4) ? argv[4] : null;
		var secure = (argc > 5) ? argv[5] : false;
		document.cookie = name + "=" + escape(value) + ((expires === null) ? "" : ("; expires=" + expires.toGMTString())) + ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
	},
	get : function (name) {
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		var j = 0;
		while (i < clen) {
			j = i + alen;
			if (document.cookie.substring(i, j) == arg) {
				return Cookies.getCookieVal(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if (i === 0) {
				break;
			}
		}
		return null;
	},
	clear : function (name) {
		if (Cookies.get(name)) {
			document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	},
	getCookieVal : function (offset) {
		var endstr = document.cookie.indexOf(";", offset);
		if (endstr == -1) {
			endstr = document.cookie.length;
		}
		return unescape(document.cookie.substring(offset, endstr));
	}
};

function setCookie(c_name, value, exdays) {
	// encode object to string
	if (typeof value == "object") {
		try {
			value = Ext.encode(value);
		} catch (err) {
			console.log(err);
		}
	}
	Cookies.set(c_name, value);
}

function getCookie(c_name) {
	var value = Cookies.get(c_name);
	// try to decode (if object)
	try {
		value = Ext.decode(value);
	} catch (err) {
		// value is not encoded object
	}
	return value;
}

function clearCookie(c_name) {
	Cookies.clear(c_name);
}