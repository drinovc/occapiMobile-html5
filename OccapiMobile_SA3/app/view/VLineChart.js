/*
 * File: app/view/VLineChart.js
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

Ext.define('OccapiMobile.view.VLineChart', {
    extend: 'Ext.Panel',
    alias: 'widget.VLineChart',

    requires: [
        'Ext.TitleBar',
        'Ext.Button',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Time',
        'Ext.chart.series.Line',
        'Ext.chart.Legend',
        'Ext.XTemplate',
        'Ext.chart.interactions.PanZoom'
    ],

    config: {
        itemId: 'VLineChart',
        layout: 'fit',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                height: 46,
                margin: 0,
                padding: 0,
                items: [
                    {
                        xtype: 'button',
                        height: 46,
                        itemId: 'btnLineChartBack',
                        margin: 0,
                        padding: '0 10',
                        ui: 'plain',
                        text: 'Back'
                    }
                ]
            },
            {
                xtype: 'chart',
                animate: false,
                colors: [
                    '#115fa6',
                    '#94ae0a',
                    '#a61120',
                    '#ff8809',
                    '#ffd13e',
                    '#a66111',
                    '#24ad9a',
                    '#ff0000',
                    '#a66111'
                ],
                innerPadding: {
                    top: 5,
                    left: 5,
                    right: 5,
                    bottom: 5
                },
                store: 'StoreCharts',
                axes: [
                    {
                        type: 'time',
                        fields: [
                            'dateTime'
                        ],
                        label: {
                            x: 0,
                            y: 0,
                            textBaseline: 'middle',
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Helvetica',
                            color: '#999999'
                        },
                        labelInSpan: true,
                        style: {
                            stroke: 'none'
                        },
                        dateFormat: 'H:i:s'
                    },
                    {
                        type: 'numeric',
                        renderer: function(labelText, layout, lastLabelText) {
                            var timeS = Ext.Date.format(new Date(labelText), App.s.timeFormat);
                            return timeS;
                        },
                        fields: [
                            'x'
                        ],
                        hidden: true,
                        label: {
                            x: 0,
                            y: 0,
                            textBaseline: 'middle',
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Helvetica',
                            color: '#999999'
                        },
                        labelInSpan: true,
                        style: {
                            stroke: 'none'
                        }
                    },
                    {
                        type: 'numeric',
                        fields: [
                            'y1',
                            'y2',
                            'y3'
                        ],
                        grid: {
                            stroke: 'dddddd'
                        },
                        label: {
                            x: 0,
                            y: 0,
                            textBaseline: 'middle',
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'Helvetica',
                            color: '#999999'
                        },
                        position: 'left',
                        style: {
                            stroke: 'none'
                        }
                    }
                ],
                series: [
                    {
                        type: 'line',
                        colors: 'rgba(0,200,0,0.3)',
                        label: {
                            textBaseline: 'middle',
                            textAlign: 'center',
                            font: '14px Helvetica'
                        },
                        labelField: 'y1Label',
                        marker: {
                            type: 'circle',
                            radius: 3,
                            lineWidth: 2,
                            fill: '#ffffff'
                        },
                        style: {
                            smooth: false,
                            stroke: 'rgb(54,68,82)',
                            lineCap: 'miter',
                            lineWidth: 2
                        },
                        xField: 'dateTime',
                        yField: 'y1'
                    },
                    {
                        type: 'line',
                        colors: 'transparent',
                        labelField: 'y2Label',
                        marker: {
                            type: 'circle',
                            radius: 3,
                            lineWidth: 2,
                            fill: '#ffffff'
                        },
                        style: {
                            stroke: 'rgb(248,153,29)',
                            smooth: false,
                            lineCap: 'miter',
                            lineWidth: 2
                        },
                        xField: 'dateTime',
                        yField: 'y2'
                    },
                    {
                        type: 'line',
                        colors: 'transparent',
                        labelField: 'y3Label',
                        marker: {
                            type: 'circle',
                            radius: 3,
                            lineWidth: 2,
                            fill: '#ffffff'
                        },
                        style: {
                            stroke: 'rgb(52,147,244)',
                            smooth: false,
                            lineCap: 'miter',
                            lineWidth: 2
                        },
                        xField: 'dateTime',
                        yField: 'y3'
                    }
                ],
                legend: {
                    xtype: 'legend',
                    itemTpl: Ext.create('Ext.XTemplate', 
                        '<span class="x-legend-item-marker {[values.disabled?\'x-legend-inactive\':\'\']}" style="background:{mark};"></span>{[this.render(values)]}',
                        {
                            render: function(values) {
                                return App.sel.chartLegend[values.name];
                            }
                        }
                    )
                },
                interactions: [
                    {
                        type: 'panzoom'
                    }
                ]
            }
        ]
    }

});