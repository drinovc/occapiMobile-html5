/*
 * File: app.js
 *
 * This file was generated by Sencha Architect version 3.0.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

// @require @packageOverrides
Ext.Loader.setConfig({
    disableCaching: false
});


Ext.application({

    requires: [
        'Ext.Loader'
    ],
    viewport: {
        autoMaximize: true
    },

    models: [
        'ModelKPIGroup',
        'ModelKPI',
        'ModelChart',
        'ModelAlert',
        'ModelMenu'
    ],
    stores: [
        'StoreKPIGroups',
        'StoreKPIs',
        'StoreCharts',
        'StoreAlerts',
        'StoreMenu'
    ],
    views: [
        'VLogin',
        'VNav',
        'VKPIGroups',
        'VKPIs',
        'VAlerts',
        'VLineChart',
        'VSettings',
        'VAlertDetails',
        'VAbout',
        'VMain',
        'MyLineChart1'
    ],
    controllers: [
        'CLogin',
        'CKPIGroups',
        'CKPIs',
        'CAlerts',
        'CCharts',
        'CNav',
        'CSettings',
        'CAlertDetails',
        'CMain'
    ],
    name: 'OccapiMobile',
    startupImage: {
        '320x460': 'occapi_logo_login.png',
        '640x920': 'occapi_logo_login.png',
        '640x1096': 'occapi_logo_login.png',
        '768x1004': 'occapi_logo_login.png',
        '748x1024': 'occapi_logo_login.png',
        '1536x2008': 'occapi_logo_login.png',
        '1496x2048': 'occapi_logo_login.png'
    },

    launch: function() {
        App = this;

        settings.init();

        // SETTINGS
        App.s = {
            debug: false,
            allowCrossOrigin: true,
            dateTimeFormat: "d-m-Y H:i:s",
            timeFormat: "H:i:s"
        };

        // CONSTANTS
        App.c = {
            apiBaseURL: App.s.allowCrossOrigin ? "http://212.235.191.163:8080/inteliui/resources/" : "http://drinovc.si/dev/occapiMobile/api/"
        };

        // USER DATA
        App.user = {
            user: null,
            pass: null,
            token: null
        };

        // SELECTION DATA
        App.sel = {
            groupName: null,
            kpiName: null,
            monitor: null,
            chartData: null,
            chartLegend: null
        };

        // DEFER IDS
        App.deferIds = {
            alerts: null,
            charts: null
        };

        // SELECTION RECORDS
        App.recKPIGroup = null;
        App.recKPI = null;

        // STORES
        App.storeKPIGroups = Ext.getStore("StoreKPIGroups");
        App.storeKPIs = Ext.getStore("StoreKPIs");
        App.storeCharts = Ext.getStore("StoreCharts");
        App.storeAlerts = Ext.getStore("StoreAlerts");

        // CONTROLLERS
        App.CNav = App.getController("CNav");
        App.CLogin = App.getController("CLogin");
        App.CMain = App.getController("CMain");
        App.CKPIGroups = App.getController("CKPIGroups");
        App.CKPIs = App.getController("CKPIs");
        App.CAlerts = App.getController("CAlerts");
        App.CCharts = App.getController("CCharts");
        App.CSettings = App.getController("CSettings");
        App.CAlertDetails = App.getController("CAlertDetails");

        // VIEWS
        App.VNav = null;
        App.VMain = null;
        App.VMenu = null;
        App.VLogin = null;
        App.VKPIGroups = null;
        App.VKPIs = null;
        App.VAlerts = null;
        App.VLineChart = null;
        App.VAlertDetails = null;


        App.initGlobalHandlers();
        Ext.create('OccapiMobile.view.VNav', {fullscreen: true});
    },

    initGlobalHandlers: function() {
        // RELATIVE REQUESTS (API BASE + ...)
        Ext.Ajax.on("beforerequest", function(conn, options, eOpts) {
            if(options.url) {
                if(App.s.allowCrossOrigin) {
                    options.url = options.url.replace(/\{user\}/ig, App.user.user);
                    options.url = options.url.replace(/\{pass\}/ig, App.user.pass);
                    options.url = options.url.replace(/\{token\}/ig, App.user.token);
                    options.url = options.url.replace(/\{groupName\}/ig, App.sel.groupName);
                    options.url = options.url.replace(/\{kpi\}/ig, App.sel.kpiName);
                    options.url = options.url.replace(/\{monitor\}/ig, App.sel.monitor);

                    options.url = App.c.apiBaseURL + options.url;
                }
                else {
                    options.url = App.c.apiBaseURL;
                }
            }
        });

        // GLOBAL REQUEST EXCEPTION MESSAGE
        Ext.Ajax.on("requestexception", function (conn, response, options, eOpts) {
        	App.unmask();

            if(!App.VLogin.isHidden()) {
                return;
            }

        	if (response.status == -1) {
        		debugLog("Request canceled");
        		return;
        	}

        	var params = "";
        	Ext.Object.each(options.params, function (key, value) {
        		params += "&nbsp;-&nbsp;<b>" + key + ":</b> " + value + "<br />";
        	});
        	params = params.replace(/,/g, ", ");

        	var info = null;

        	if (response.status === 0) {
        		if (response.timedout) {
        			// request timedout
        			info = "<b>INFO:</b> Request timed out. Please check your connection to server.<br />";
        		} else {
        			// server unreachable
        			info = "<b>INFO:</b> Server may be unreachable. Please check your connection to server.<br />";
        		}
        	}
            else if (response.status == 401) {
                info = "Session timed-out. <br />Please login again.";
                response.responseText = null;
            }
            else {
                info = "Status code " + response.status;
            }

        	var msg = "";
        	var url = options.url;
        	var status = response.status;

        	if (App.s.debug) {
        		// show long message
        		msg = "<b>TYPE:</b> request exception<br />" +
        			"<b>METHOD:</b> " + options.method + "<br />" +
        			"<b>URL:</b> " + url + "<br />" +
        			"<b>STATUS:</b> " + status + "<br />" +
        			info +
        			"<b>RESPONSE:</b> " + response.responseText + "<br />" +
        			"<b>PARAMS:</b><br />" + params + "<br />";
        	} else {
        		// show simple message
        		msg = info;
        	}

        	Ext.Msg.show({
        		title : "Error",
        		message : msg,
        		fn : function () {
        			Ext.Msg.removeCls("global-err-msg"); // REMOVE custom global msg style
        		},
        		buttons : Ext.Msg.OK,
                cls : App.s.debug ? "global-err-msg" : ""
        	});
        });

        /*
        // INTERCEPT EVERY REQUEST for error checking, verson compare,...
        // GLOBAL "SUCCESS == FALSE" MESSAGE
        Ext.Ajax.on('requestcomplete', function (connection, response, options) {
        	try {
        		var intercept = Ext.decode(response.responseText);
        		if (intercept) {
        			if (!intercept.success) {
        				App.unmask();

        				var params = "";
        				Ext.Object.each(options.params, function (key, value) {
        					params += "&nbsp;-&nbsp;<b>" + key + ":</b> " + value + "<br />";
        				});
        				params = params.replace(/,/g, ", ");

        				var msg = "";
        				var dll = options.url.substr(0, App.c.apiBaseURL.length - 1);
        				var url = options.url.substring(App.c.apiBaseURL.length - 1, options.url.indexOf("?") != -1 ? options.url.indexOf("?") : undefined);
        				var status = response.status;

        				if (App.s.debug) {
        					// show long message
        					msg = "<b>TYPE:</b> success false<br />" +
        						"<b>METHOD:</b> " + options.method + "<br />" +
        						"<b>DLL:</b> " + dll + "<br />" +
        						"<b>URL:</b> " + url + "<br />" +
        						"<b>STATUS:</b> " + status + "<br />" +
        						"<b>REASON:</b> " + intercept.reason + "<br />" +
        						"<b>PARAMS:</b><br />" + params + "<br />";
        				} else {
        					// show simple message
        					msg = "<b>REASON:</b> " + intercept.reason + "<br />" +
        						"<b>At " + url + "</b>";
        				}

        				Ext.Msg.show({
        					title : "Error",
        					message : msg,
        					fn : function () {
        						Ext.Msg.removeCls("global-err-msg"); // REMOVE custom global msg style
        					},
        					buttons : Ext.Msg.OK,
        					cls : "global-err-msg"

        				});
        				return;
        			}
        		}
        	} catch (e) {
        		Ext.Msg.alert("Error", "Can not parse message intercepted at ajax request: " + e.message);
        	}
        }, this);
        */
    },

    mask: function(msg) {
        Ext.Viewport.mask({
            xtype: "loadmask",
            message: msg
        });
    },

    unmask: function() {
        Ext.Viewport.unmask();
    }

});
