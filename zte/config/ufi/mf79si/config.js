define(function() {
    var config = {
        PRODUCT_TYPE: 'UFI',
        LOGIN_SECURITY_SUPPORT: true,
        PASSWORD_ENCODE: true,
        HAS_MULTI_SSID: false,
        IPV6_SUPPORT: true,
        WIFI_BANDWIDTH_SUPPORT: true,
        AP_STATION_SUPPORT: false,
        WIFI_BAND_SUPPORT: true,
        MAX_STATION_NUMBER: 14,
		WIFI_HAS_5G: true,
        WEBUI_TITLE: '4G Mobile Hotspot',
        WIFI_SUPPORT_QR_CODE: true,
		HAS_BATTERY:false,
		SD_CARD_SUPPORT: true,
		WIFI_HAS_5G:false,
        AUTO_MODES: [ {
            name: 'Automatic',
            value: 'WCDMA_AND_LTE'
        }, {
            name: '4G Only',
            value: 'Only_LTE'
        }, {
            name: '3G Only',
            value: 'Only_WCDMA'
        }],
		TIME_UNITS: [ {
            name: 'hour',
            value: '60'
        }, {
            name: 'Minutes',
            value: '1'
        }]
    };

    return config;
});
