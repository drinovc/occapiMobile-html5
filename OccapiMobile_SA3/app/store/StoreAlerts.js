/*
 * File: app/store/StoreAlerts.js
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

Ext.define('OccapiMobile.store.StoreAlerts', {
    extend: 'Ext.data.Store',

    requires: [
        'OccapiMobile.model.ModelAlert',
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.util.Sorter'
    ],

    config: {
        model: 'OccapiMobile.model.ModelAlert',
        storeId: 'StoreAlerts',
        proxy: {
            type: 'rest',
            extraParams: {
                action: 'alerts'
            },
            url: 'alerts/all_alerts/token/{token}',
            useDefaultXhrHeader: false,
            reader: {
                type: 'json',
                rootProperty: 'alerts'
            }
        },
        sorters: {
            direction: 'DESC',
            property: 'timestamp'
        }
    }
});