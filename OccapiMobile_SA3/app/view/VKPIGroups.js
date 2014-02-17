/*
 * File: app/view/VKPIGroups.js
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

Ext.define('OccapiMobile.view.VKPIGroups', {
    extend: 'Ext.dataview.List',
    alias: 'widget.VKPIGroups',

    requires: [
        'Ext.XTemplate',
        'Ext.plugin.PullRefresh'
    ],

    config: {
        itemId: 'VKPIGroups',
        padding: '1 0 0 0',
        emptyText: 'No KPI Groups',
        store: 'StoreKPIGroups',
        itemTpl: [
            '<div>{kpiGroupCaption}</div>',
            '<div class="disclosure-image"></div>'
        ],
        plugins: [
            {
                type: 'pullrefresh'
            }
        ]
    }

});