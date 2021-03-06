/*
 * File: app/controller/CLogin.js
 *
 * This file was generated by Sencha Architect
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

Ext.define('OccapiMobile.controller.CLogin', {
    extend: 'Ext.app.Controller',

    config: {
        control: {
            "button#btnLogin": {
                tap: 'onBtnLoginTap'
            },
            "passwordfield#tfPass": {
                action: 'onTfPassAction'
            }
        }
    },

    onBtnLoginTap: function(button, e, eOpts) {
        this.login();
    },

    onTfPassAction: function(textfield, e, eOpts) {
        this.login();
    },

    login: function() {
        App.user.user = App.VNav.down("#tfUser").getValue();
        App.user.pass = App.VNav.down("#tfPass").getValue();

        if(App.user.user.trim().length === 0) {
            Ext.Msg.alert(null, "Email field should not be empty", function() {
                App.VNav.down("#tfUser").focus();
            }, this);
            return;
        }

        if(App.user.pass.trim().length === 0) {
            Ext.Msg.alert(null, "Password field should not be empty", function() {
                App.VNav.down("#tfPass").focus();
            }, this);
            return;
        }

        App.VLogin.down("container").hide();
        App.mask("Signing in...");

        Ext.Ajax.request({
            method: "GET",
            params: {
                action: "login",
                user: App.user.user,
                pass: App.user.pass
            },
            url: App.s.allowCrossOrigin ? "login/{user}/{pass}" : App.c.apiBaseURL,
            scope: this,
            useDefaultXhrHeader: false,
            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);

                if (obj.status){
                    if(settings.get(settings.names.rememberMe)) {
                        setCookie("user", App.user.user);
                        if(settings.get(settings.names.autoLogin)) {
                            setCookie("pass", App.user.pass);
                        }
                    }
                    else {
                        Ext.Msg.alert(null, "Not remembering");
                    }
                    App.user.token = obj.token;

                    App.storeKPIGroups.load({
                        params: {
                            token: App.user.token
                        },
                        callback: function(records, operation, success) {
                            if(success) {
                                App.VNav.setShowAnimation({
                                    type: "slide",
                                    direction: "right"
                                });
                                /*
                                App.VKPIGroups = App.VNav.push({
                                    xtype: "VKPIGroups",
                                    title: "KPI Groups"
                                });
                                */
                                App.VMain = App.VNav.push({
                                    xtype: "VMain",
                                    title: "OccapiMobile"
                                });
                                App.VMenu = App.VMain.down("sheet");
                            }
                            App.unmask();
                        }
                    });
                }
                else {
                    Ext.Msg.alert(null, obj.message);
                    App.unmask();
                    App.VLogin.down("container").show();
                }
            },
            failure: function(response, opts) {
                Ext.Msg.alert(null, "Wrong email or password");
                App.VLogin.down("container").show();
            }
        });
    },

    logout: function() {
        if(!settings.get(settings.names.rememberMe)) {
            App.VLogin.down("#tfUser").setValue("");
        }
        App.VLogin.down("#tfPass").setValue("");

        App.VLogin.down("container").show();

        App.VNav.pop(3);

        App.CAlerts.stop();
        App.CCharts.stop();

        App.VNav.getNavigationBar().hide();
        App.user = {
            token: null
        };
    }

});