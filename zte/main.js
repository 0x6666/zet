﻿window.zte_web_ui_is_test = false;
var inputContext = ''; //用于获取弹出框里输入框键入的内容
var currentKeyID = 0;
/**
 * 设定公用模块别名
 * @config require.config
 */
require.config({
    paths: {
        text: 'lib/require/text',
        tmpl: '../tmpl',
        underscore: 'lib/underscore/underscore',
        knockout: 'lib/knockout/knockout',
        jquery: 'lib/require/require-jquery',
        jq_validate: 'lib/jquery/jquery.validate',
        jq_additional: 'lib/jquery/additional-methods',
        jq_i18n: 'lib/jquery/jquery.i18n.properties-1.0.9',
        jq_translate: 'lib/jquery/translate',
        jq_tmpl: 'lib/jquery/jquery.tmpl.min',
        knockoutbase: 'lib/knockout/knockout-2.1.0',
        jq_simplemodal: 'lib/jquery/jquery.simplemodal-1.4.2',
        base64: 'lib/base64',
        jqui: 'lib/jqui/jquery-ui.min',
        echarts: 'lib/echarts',
        'echarts/chart/pie': 'lib/echarts'
    },

    shim: {
        jq_additional: ['jq_validate'],
        jq_translate: ['jq_i18n'],
        knockoutbase: ['jq_tmpl'],
        jq_simplemodal: ['lib/bootstrap']
    }
});

//preload device config
require(['service', 'config/config', 'util', zte_web_ui_is_test ? 'simulate' : ''], function (service, config, util, simulate) {
    if (zte_web_ui_is_test) {
        window.simulate = simulate;
    }
    if (config.DEVICE.toLowerCase().indexOf("cpe") !=-1) {
        var menuResource = "menu";
        service.getOpMode({}, function (data) {
            config.opms_wan_mode = data.opms_wan_mode;
            switch (data.opms_wan_mode) {
                case "BRIDGE":
                    menuResource = "menu_bridge";
                    break;
                case "PPPOE":
                case "DHCP":
                case "STATIC":
                    menuResource = "menu_pppoe";
                    break;
                case "PPP":
                    menuResource = "menu_4ggateway";
                    break;
                default:
                    menuResource = "menu";
                    break;
            }
            loadMenuAndThird({
                menu: 'config/' + config.DEVICE + '/' + menuResource,
                config: 'config/' + config.DEVICE + '/config'
            });
        });
    } else {
        loadMenuAndThird({
            menu: 'config/' + config.DEVICE + '/menu',
            config: 'config/' + config.DEVICE + '/config'
        });
    }

    function loadMenuAndThird(params) {
        require([params.menu, params.config], function (deviceMenu) {
            require([
                'app',
                'jq_additional',
                'jq_translate',
                'jq_simplemodal',
                'base64'
            ], function (app) {
                app.init();
            });
        });
    }
});

