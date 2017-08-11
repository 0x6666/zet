/**
 * home 模块
 * @module home
 * @class home
 */

define(['knockout', 'service', 'jquery', 'config/config', 'underscore', 'status/statusBar', 'echarts', 'echarts/chart/pie'],
    function (ko, service, $, config, _, statusBar, echarts) {
        var popoverShown = false;
        var CONNECT_STATUS = {CONNECTED: 1, DISCONNECTED: 2, CONNECTING: 3, DISCONNECTING: 4};
        var myChart = null;
        var refreshCount = 0;
        var chartOptions = {
            title: {
                text: '',
                x: 'center',
                y: 'center',
                itemGap: 0,
                textStyle: {
                    color: '#D8D8D8',
                    fontFamily: '微软雅黑',
                    fontSize: 20,
                    fontWeight: 'bolder'
                },
                subtextStyle: {
                    color: '#D8D8D8',
                    fontFamily: '微软雅黑',
                    fontSize: 16,
                    fontWeight: 'bolder'
                }
            },
            animation: false,
            series: [
                {
                    name: '流量控制',
                    type: 'pie',
                    radius: ['65', '93'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    data: [

                    ],
                    selectedOffset: 3
                }
            ],
            color: ['red', 'red', 'red', 'red', 'red']
        };

        /**
         * HomeViewMode
         * @class HomeViewMode
         */

        function HomeViewMode() {
            var self = this;
            self.cpeMode = null;
            self.isSupportSD = config.SD_CARD_SUPPORT;
            self.visibility = config.INCLUDE_MOBILE? "visible" : "hidden";
            self.isCPE = config.DEVICE.toLowerCase().indexOf("cpe") !=-1;
            self.notDataCard = !(config.DEVICE.toLowerCase().indexOf("datacard") !=-1);
            self.showQRCode = config.WIFI_SUPPORT_QR_CODE;
            self.qrcodeSrc = './img/qrcode_ssid_wifikey.png?_=' + $.now();
            if(self.isCPE){
                var opModeObj = service.getOpMode();
                self.cpeMode = opModeObj.opms_wan_mode;
                self.isShowHomeConnect = ko.observable(homeUtil.showHomeConnect(opModeObj.opms_wan_mode));
            } else {
                self.isShowHomeConnect = ko.observable(true);
            }

            if(config.DEVICE.toLowerCase().indexOf("datacard") !=-1) {
                $('#home_image').addClass('data-card');
            }

            var info = service.getConnectionInfo();
            self.networkType = ko.observable(homeUtil.getNetworkType(info.networkType));
            self.connectStatus = ko.observable(info.connectStatus);
            self.canConnect = ko.observable(false);
            self.cStatus = ko.computed(function () {
                if (self.connectStatus().indexOf('_connected') != -1) {
                    return CONNECT_STATUS.CONNECTED;
                } else if (self.connectStatus().indexOf('_disconnecting') != -1) {
                    return CONNECT_STATUS.DISCONNECTING;
                } else if (self.connectStatus().indexOf('_connecting') != -1) {
                    return CONNECT_STATUS.CONNECTING;
                } else {
                    return CONNECT_STATUS.DISCONNECTED;
                }
            });

            self.current_Flux = ko.observable(transUnit(0, false));
            self.connected_Time = ko.observable(transSecond2Time(0));
            self.up_Speed = ko.observable(transUnit(0, true));
            self.down_Speed = ko.observable(transUnit(0, true));
            //////////////////////////

            self.isLoggedIn = ko.observable(false);
            self.enableFlag = ko.observable(false);

            self.simSerialNumber = ko.observable('');
            self.imei = ko.observable('');
            self.imsi = ko.observable('');
            self.wifiLongMode = ko.observable('');

            self.trafficAlertEnable = ko.observable(false);
            self.trafficUsed = ko.observable('');
            self.trafficLimited = ko.observable('');

            self.wireDeviceNum = ko.observable(0);
            self.wirelessDeviceNum = ko.observable(0);

            self.showOpModeWindow = function () {
                showSettingWindow("change_mode", "opmode/opmode_popup", "opmode/opmode_popup", 400, 300, function () {
                });
            };
            self.currentOpMode = ko.observable("0");
            bindEvent(self);
            fetchDeviceInfo(self);

            if (self.isCPE) {
                service.getOpMode({}, function (data) {
                    self.isLoggedIn(data.loginfo == "ok");
                    if (data.opms_wan_mode == "DHCP") {
                        self.enableFlag(true);
                    } else if (data.ppp_status != "ppp_disconnected") {
                        self.enableFlag(false);
                    } else {
                        self.enableFlag(true);
                    }
                    var mode = (data.opms_wan_mode == "DHCP" || data.opms_wan_mode == "STATIC") ? "PPPOE" : data.opms_wan_mode;
                    var currentOpMode = "";
                    switch (mode) {
                        case "BRIDGE":
                            currentOpMode = "opmode_bridge";
                            break;
                        case "PPPOE":
                            currentOpMode = "opmode_cable";
                            break;
                        case "PPP":
                            currentOpMode = "opmode_gateway";
                            break;
                        default:
                            break;
                    }
                    $("#opmode").attr("data-trans", currentOpMode).text($.i18n.prop(currentOpMode));
                });
            }

            self.connectHandler = function () {
                if (checkConnectedStatus(self.connectStatus())) {
                    showLoading('disconnecting');
                    service.disconnect({}, function (data) {
                        if (data.result) {
                            successOverlay();
//                            opmode.init();
                        } else {
                            errorOverlay();
                        }
                    });
                } else {
                    if (service.getStatusInfo().roamingStatus) {
                        showConfirm('dial_roaming_connect', function () {
                            self.connect();
//                            opmode.init();
                        });

                    } else {
                        self.connect();
//                        opmode.init();
                    }
                }
            };

            self.connect = function () {
                var statusInfo = service.getStatusInfo();
                var trafficResult = statusBar.getTrafficResult(statusInfo);
                if (statusInfo.limitVolumeEnable && trafficResult.showConfirm) {
                    var confirmMsg = null;
                    if (trafficResult.usedPercent > 100) {
                        confirmMsg = {msg: 'traffic_beyond_connect_msg'};
                        statusBar.setTrafficAlertPopuped(true);
                    } else {
                        confirmMsg = {msg: 'traffic_limit_connect_msg', params: [trafficResult.limitPercent]};
                        statusBar.setTrafficAlert100Popuped(false);
                    }
                    showConfirm(confirmMsg, function () {
                        homeUtil.doConnect();
                    });
                } else {
                    homeUtil.doConnect();
                }
            };

            self.isCPE && addInterval(function () {
                var obj = service.getConnectionInfo();
                if (obj.opms_wan_mode == "DHCP") {
                    self.enableFlag(true);
                } else if (obj.connectStatus != "ppp_disconnected") {
                    self.enableFlag(false);
                } else {
                    self.enableFlag(true);
                }
            }, 1000);
            addInterval(function () {
                service.getSignalStrength({}, function (data) {
                    var signalTxt = signalFormat(convertSignal(data));
                    $("#fresh_signal_strength").text(signalTxt);
                    if (popoverShown) {
                        $("#popoverSignalTxt").text(signalTxt);
                    }
                });
                homeUtil.refreshHomeData(self);
            }, 1000);
        }

        function fetchDeviceInfo(vm) {
            var data = service.getDeviceInfo();
            vm.simSerialNumber(verifyDeviceInfo(data.simSerialNumber));
            vm.imei(verifyDeviceInfo(data.imei));
            vm.imsi(verifyDeviceInfo(data.imsi));
            vm.wifiLongMode("wifi_des_" + data.wifiRange);
            return data;
        }

        function getDetailInfoContent(vm) {
            var data = fetchDeviceInfo(vm);
            homeUtil.initShownStatus(data);
            var addrInfo = homeUtil.getWanIpAddr(data);
            var compiled = _.template($("#detailInfoTmpl").html());
            var tmpl = compiled({
                simSerialNumber: verifyDeviceInfo(data.simSerialNumber),
                imei: verifyDeviceInfo(data.imei),
                imsi: verifyDeviceInfo(data.imsi),
                signal: signalFormat(data.signal),
                hasWifi: config.HAS_WIFI,
                isCPE: config.DEVICE.toLowerCase().indexOf("cpe") !=-1,
                showMultiSsid: config.HAS_MULTI_SSID && data.multi_ssid_enable == "1",
                ssid: verifyDeviceInfo(data.ssid),
                max_access_num: verifyDeviceInfo(data.max_access_num),
                m_ssid: verifyDeviceInfo(data.m_ssid),
                m_max_access_num: verifyDeviceInfo(data.m_max_access_num),
                wifi_long_mode: "wifi_des_" + data.wifiRange,
                lanDomain: verifyDeviceInfo(data.lanDomain),
                ipAddress: verifyDeviceInfo(data.ipAddress),
                showMacAddress: config.SHOW_MAC_ADDRESS,
                macAddress: verifyDeviceInfo(data.macAddress),
                showIpv4WanIpAddr: homeUtil.initStatus.showIpv4WanIpAddr,
                wanIpAddress: addrInfo.wanIpAddress,
                showIpv6WanIpAddr: homeUtil.initStatus.showIpv6WanIpAddr,
                ipv6WanIpAddress: addrInfo.ipv6WanIpAddress,
                sw_version: verifyDeviceInfo(data.sw_version),
                fw_version: verifyDeviceInfo(data.fw_version),
                hw_version: verifyDeviceInfo(data.hw_version)
            });
            return  $(tmpl).translate();
        }

        var homeUtil = {
            initStatus: null,

            initShownStatus: function (data) {
                this.initStatus = {};
                if(config.DEVICE.toLowerCase().indexOf("cpe") !=-1) {
                    if (data.opms_wan_mode == "BRIDGE") {
                        this.initStatus.showIpv6WanIpAddr = false;
                        this.initStatus.showIpv4WanIpAddr = false;
                    } else if (data.opms_wan_mode == "DHCP" || data.opms_wan_mode == "PPPOE") {
                        this.initStatus.showIpv6WanIpAddr = false;
                        this.initStatus.showIpv4WanIpAddr = true;
                    } else if (data.opms_wan_mode == "STATIC") {
                        this.initStatus.showIpv6WanIpAddr = false;
                        this.initStatus.showIpv4WanIpAddr = true;
                    } else if (config.IPV6_SUPPORT) {//支持IPV6
                        if (data.pdpType == "IP") {//ipv4
                            this.initStatus.showIpv6WanIpAddr = false;
                            this.initStatus.showIpv4WanIpAddr = true;
                        } else if (data.pdpType == "IPv6") {//ipv6(&ipv4)                             
							this.initStatus.showIpv6WanIpAddr = true;
							this.initStatus.showIpv4WanIpAddr = false;
                        }else if (data.pdpType == "IPv4v6") {						
							this.initStatus.showIpv6WanIpAddr = true;
                            this.initStatus.showIpv4WanIpAddr = true;
						}
                    } else {//不支持IPV6
                        this.initStatus.showIpv6WanIpAddr = false;
                        this.initStatus.showIpv4WanIpAddr = true;
                    }
                } else {
                    if (config.IPV6_SUPPORT) {//支持IPV6
                        if (data.pdpType == "IP") {//ipv4
                            this.initStatus.showIpv6WanIpAddr = false;
                            this.initStatus.showIpv4WanIpAddr = true;
                        } else if (data.pdpType == "IPv6") {//ipv6(&ipv4)                             
							this.initStatus.showIpv6WanIpAddr = true;
							this.initStatus.showIpv4WanIpAddr = false;
                        }else if (data.pdpType == "IPv4v6") {						
							this.initStatus.showIpv6WanIpAddr = true;
                            this.initStatus.showIpv4WanIpAddr = true;
						}
                    } else {//不支持IPV6
                        this.initStatus.showIpv6WanIpAddr = false;
                        this.initStatus.showIpv4WanIpAddr = true;
                    }
                }
            },
            getWanIpAddr: function (data) {
                var addrInfo = {
                    wanIpAddress: '',
                    ipv6WanIpAddress: ''
                };
                if (data.opms_wan_mode == "DHCP" || data.opms_wan_mode == "PPPOE") {
                    addrInfo.wanIpAddress = verifyDeviceInfo(data.wanIpAddress);
                } else if (data.opms_wan_mode == "STATIC") {
                    addrInfo.wanIpAddress = verifyDeviceInfo(data.staticWanIpAddress);
                } else/* if (data.opms_wan_mode == "PPP")*/ {
                    var connectStatus = this.getConnectStatus(data.connectStatus);
                    if (connectStatus == 1) {
                        addrInfo.wanIpAddress = verifyDeviceInfo(data.wanIpAddress);
                        addrInfo.ipv6WanIpAddress = "— —";
                    } else if (connectStatus == 2) {
                        addrInfo.wanIpAddress = "— —";
                        addrInfo.ipv6WanIpAddress = verifyDeviceInfo(data.ipv6WanIpAddress);
                    } else if (connectStatus == 3) {
                        addrInfo.wanIpAddress = verifyDeviceInfo(data.wanIpAddress);
                        addrInfo.ipv6WanIpAddress = verifyDeviceInfo(data.ipv6WanIpAddress);
                    } else {
                        addrInfo.wanIpAddress = "— —";
                        addrInfo.ipv6WanIpAddress = "— —";
                    }
                }
                return addrInfo;
            },

            getConnectStatus: function (status) {
                if (status == "ppp_disconnected" || status == "ppp_connecting" || status == "ppp_disconnecting") {
                    return 0;
                } else if (status == "ppp_connected") {
                    return 1;
                } else if (status == "ipv6_connected") {
                    return 2;
                } else if (status == "ipv4_ipv6_connected") {
                    return 3;
                }
            },
            showHomeConnect: function (opms_wan_mode) {
                return "PPP" == opms_wan_mode;
            },
            cachedAPStationBasic: null,
            cachedConnectionMode: null,
            getCanConnectNetWork: function () {
                var status = service.getStatusInfo();
                if (status.simStatus != "modem_init_complete") {
                    return false;
                }
                var networkTypeTmp = status.networkType.toLowerCase();
                if (networkTypeTmp == '' || networkTypeTmp == 'limited service') {
                    networkTypeTmp = 'limited_service';
                }
                if (networkTypeTmp == 'no service') {
                    networkTypeTmp = 'no_service';
                }
                if(networkTypeTmp == 'limited_service' || networkTypeTmp == 'no_service') {
                    return false;
                }

                if (checkConnectedStatus(status.connectStatus)) {
                    if (config.AP_STATION_SUPPORT) {
                        if (service.getAPStationBasic().ap_station_enable == 1) {
                            if (status.dialMode == "auto_dial") {
                                return false;
                            }
                        }
                    }
                }

                if (config.AP_STATION_SUPPORT) {
                    if (status.connectWifiStatus == "connect") {
                        if (service.getAPStationBasic().ap_station_mode == "wifi_pref") {
							return false;
                        }
                    }
                }
                return true;
            },
            doConnect: function () {
                showLoading('connecting');
                service.connect({}, function (data) {
                    if (data.result) {
                        successOverlay();
                    } else {
                        errorOverlay();
                    }
                });
            },
            refreshHomeData: function (vm) {
                var info = service.getConnectionInfo();
                vm.connectStatus(info.connectStatus);
                vm.canConnect(this.getCanConnectNetWork());
                vm.networkType(homeUtil.getNetworkType(info.networkType));
                if (checkConnectedStatus(info.connectStatus)) {
                    vm.current_Flux(transUnit(parseInt(info.data_counter.currentReceived, 10) + parseInt(info.data_counter.currentSent, 10), false));
                    vm.connected_Time(transSecond2Time(info.data_counter.currentConnectedTime));
                    vm.up_Speed(transUnit(info.data_counter.uploadRate, true));
                    vm.down_Speed(transUnit(info.data_counter.downloadRate, true));
                } else {
                    vm.current_Flux(transUnit(0, false));
                    vm.connected_Time(transSecond2Time(0));
                    vm.up_Speed(transUnit(0, true));
                    vm.down_Speed(transUnit(0, true));
                }

                vm.trafficAlertEnable(info.limitVolumeEnable);
                if (info.limitVolumeEnable) {
                    if (info.limitVolumeType == '1') { // Data
                        vm.trafficUsed(transUnit(parseInt(info.data_counter.monthlySent, 10) + parseInt(info.data_counter.monthlyReceived, 10), false));
                        vm.trafficLimited(transUnit(info.limitDataMonth, false));
                    } else { // Time
                        vm.trafficUsed(transSecond2Time(info.data_counter.monthlyConnectedTime));
                        vm.trafficLimited(transSecond2Time(info.limitTimeMonth));
                    }
                }
                if(!vm.isCPE || (vm.isCPE && vm.cpeMode == 'PPP')) {
                    homeUtil.updateEcharts(info);
                } else {
                    homeUtil.allFreeEcharts();
                }

                homeUtil.refreshStationInfo(vm);
            },
            allFreeEcharts: function() {
                var usedData = homeUtil.data.free;
                usedData.value = 1;
                usedData.selected = false;
                chartOptions.series[0].data = [usedData];
                chartOptions.title.text = '';
                homeUtil.setEcharts(chartOptions);
            },
            getNetworkType: function (networkType) {
                var networkTypeTmp = networkType.toLowerCase();
                if (networkTypeTmp == '' || networkTypeTmp == 'limited service') {
                    networkTypeTmp = 'limited_service';
                }
                if (networkTypeTmp == 'no service') {
                    networkTypeTmp = 'no_service';
                }
                if (networkTypeTmp == 'limited_service' || networkTypeTmp == 'no_service') {
//                   $('#h_connect_btn:visible').hide();
                    return $.i18n.prop("network_type_" + networkTypeTmp);
                } else {
//                   $('#h_connect_btn:hidden').show();
                    return networkType;
                }
            },
            data: {
                start: {
                    value: 50,
                    name: '提醒值内未使用',
                    itemStyle: {
                        normal: {
                            color: '#D8D8D8'
                        }
                    }
                },
                alarm: {
                    value: 19.7,
                    name: '警戒区',
                    itemStyle: {
                        normal: {
                            color: '#8CC916'
                        }
                    }
                },
                alert: {
                    value: 1,
                    name: '提醒值',
                    itemStyle: {
                        normal: {
                            color: '#FF5500'
                        }
                    }
                },
                free: {
                    value: 50,
                    name: '未使用',
                    itemStyle: {
                        normal: {
                            color: '#D8D8D8'
                        }
                    }
                },
                left1: {
                    value: 50,
                    name: '提醒值内未使用',
                    itemStyle: {
                        normal: {
                            color: '#D8D8D8'
                        }
                    }
                },
                used: {
                    value: 30,
                    name: '已使用',
                    itemStyle: {
                        normal: {
                            color: '#8CC916'
                        }
                    }
                },
                full: {
                    value: 30,
                    name: '流量超出',
                    itemStyle: {
                        normal: {
                            color: '#DF4313'
                        }
                    }
                }
            },
            oldUsedData: null,
            oldAlarmData: null,
            updateEcharts: function (info) {
                refreshCount++;
                if (refreshCount % 10 != 2) {
                    return false;
                }
                var total = 0, used = 0, reach = 0, left = 0, alarm = 0, left1 = 0;
                if (info.limitVolumeEnable) { //开启
                    chartOptions.series[0].data = [];
                    if (info.limitVolumeType == '1') { // 数据
                        var limitedDataFormatted = transUnit(info.limitDataMonth, false);
                        chartOptions.title.text = limitedDataFormatted;
                        chartOptions.series[0].data = [];
                        if (info.limitDataMonth == 0) {
                            var usedData = homeUtil.data.used;
                            usedData.value = 1;
                            usedData.selected = false;
                            chartOptions.series[0].data.push(usedData);
                        } else {
                            var dataInfo = homeUtil.getDataInfo(limitedDataFormatted);
                            total = dataInfo.data * homeUtil.getUnitValue(dataInfo.unit) * 1048576;
                            used = parseInt(info.data_counter.monthlySent, 10) + parseInt(info.data_counter.monthlyReceived, 10);
                            reach = total * info.limitVolumePercent / 100;
                            if (used >= total) {
                                //used = total;
                                var fullData = homeUtil.data.full;
                                fullData.value = 100;
                                chartOptions.series[0].data.push(fullData);
                            } else {
                                if (reach - used > 0) {
                                    left1 = reach - used;
                                    left = total - reach;
                                } else {
                                    alarm = used - reach;
                                    left = total - used;
                                }
                                var freeData = homeUtil.data.free;
                                freeData.value = left;
                                chartOptions.series[0].data.push(freeData);
                                if (alarm > 0) {
                                    var alarmData = homeUtil.data.alarm;
                                    alarmData.value = alarm;
                                    chartOptions.series[0].data.push(alarmData);
                                }
                                var alertData = homeUtil.data.alert;
                                alertData.value = total / 200;
                                chartOptions.series[0].data.push(alertData);
                                if (left1 > 0) {
                                    var left1Data = homeUtil.data.left1;
                                    left1Data.value = left1;
                                    chartOptions.series[0].data.push(left1Data);
                                }
                                var usedData = homeUtil.data.used;
                                if (reach - used > 0) {
                                    usedData.value = used;
                                } else {
                                    usedData.value = reach;
                                }
                                chartOptions.series[0].data.push(usedData);
                            }
                        }
                    } else { //时间
                        chartOptions.title.text = info.limitTimeMonthSource + $.i18n.prop('hours');
                        chartOptions.series[0].data = [];
                        if (info.limitTimeMonth == 0) {
                            var usedData = homeUtil.data.used;
                            usedData.value = 1;
                            usedData.selected = false;
                            chartOptions.series[0].data.push(usedData);
                        } else {
                            total = info.limitTimeMonth;
                            used = info.data_counter.monthlyConnectedTime;
                            reach = total * info.limitVolumePercent / 100;
                            if (used >= total) {
                                //used = total;
                                var fullTime = homeUtil.data.full;
                                fullTime.value = 100;
                                chartOptions.series[0].data.push(fullTime);
                            } else {
                                if (reach - used > 0) {
                                    left1 = reach - used;
                                    left = total - reach;
                                } else {
                                    alarm = used - reach;
                                    left = total - used;
                                }
                                var freeTime = homeUtil.data.free;
                                freeTime.value = left;
                                chartOptions.series[0].data.push(freeTime);
                                if (alarm > 0) {
                                    var alarmTime = homeUtil.data.alarm;
                                    alarmTime.value = alarm;
                                    chartOptions.series[0].data.push(alarmTime);
                                }
                                var alertTime = homeUtil.data.alert;
                                alertTime.value = total / 200;
                                chartOptions.series[0].data.push(alertTime);
                                if (left1 > 0) {
                                    var left1Time = homeUtil.data.left1;
                                    left1Time.value = left1;
                                    chartOptions.series[0].data.push(left1Time);
                                }
                                var usedTime = homeUtil.data.used;
                                if (reach - used > 0) {
                                    usedTime.value = used;
                                } else {
                                    usedTime.value = reach;
                                }
                                chartOptions.series[0].data.push(usedTime);
                            }
                        }
                    }
                } else {
                    var usedData = homeUtil.data.used;
                    usedData.value = 1;
                    usedData.selected = false;
                    chartOptions.series[0].data = [usedData];
                    chartOptions.title.text = '';
                }
                var firstEle = _.find(chartOptions.series[0].data, function (n) {
                    return n.name == '已使用';
                });

                var alarmEle = _.find(chartOptions.series[0].data, function (n) {
                    return n.name == '警戒区';
                });

                if(!alarmEle) {
                    alarmEle = {value: 0};
                }

                if(typeof firstEle == "undefined"){
                    homeUtil.setEcharts(chartOptions);
                } else if(homeUtil.oldUsedData != firstEle.value || homeUtil.oldAlarmData != alarmEle.value) {
                    homeUtil.oldUsedData = firstEle.value;
                    homeUtil.oldAlarmData = alarmEle.value;
                    homeUtil.setEcharts(chartOptions);
                }
            },
            setEcharts: function (options) {
                var startPart = homeUtil.data.start;
                startPart.value = 0.001;
                startPart.selected = false;
                var arr = [startPart].concat(options.series[0].data);
                options.series[0].data = arr;
                myChart.setOption(options, true);
                addTimeout(function () {
                    //$(window).trigger('resize');
                    myChart.resize();
                }, 1000);
            },
            getUnit: function (val) {
                if (val == '1024') {
                    return 'GB';
                } else if (val == '1048576') {
                    return 'TB';
                } else {
                    return 'MB';
                }
            },
            getUnitValue: function (unit) {
                unit = unit.toUpperCase();
                if (unit == 'GB') {
                    return '1024';
                } else if (unit == 'TB') {
                    return '1048576';
                } else {
                    return '1';
                }
            },
            getDataInfo: function (value) {
                return {
                    data: /\d+(.\d+)?/.exec(value)[0],
                    unit: /[A-Z]{1,2}/.exec(value)[0]
                }
            },
            refreshStationInfo: function (vm) {
                vm.wirelessDeviceNum(service.getStatusInfo().attachedDevices.length);
                if (refreshCount % 10 == 2) {
                    service.getAttachedCableDevices({}, function (data) {
                        vm.wireDeviceNum(data.attachedDevices.length);
                    });
                }
            }
        };

        function initRedirectPath(){
            function redirectNoConPath(){
                var curentHref = window.location.href;
                window.location.href = curentHref.slice(0,curentHref.indexOf("?no_connect")) + "#home";
            }

            var info = service.getStatusInfo();
            var curentHref = window.location.href;
            if(window.location.href.indexOf("?no_connect") != -1){
                if(service.getEthernetConnect().is_rj45_connected){
                    showPromptNoImg("pppoe_error_jump_login",function(){
                        window.location.href = curentHref.slice(0,curentHref.indexOf("?no_connect")) + (config.hasRJ45?"#ethernet_settings":"#home");
                    });

                } else {
                    if(info.simStatus == "modem_sim_undetected"){
                        showPromptNoImg("no_simcard_jump",function(){
                            redirectNoConPath();
                        });
                    } else if(info.simStatus == "modem_sim_destroy" || info.simStatus == "modem_destroy") {
                        showPromptNoImg("invalid_simcard_jump",function(){
                            redirectNoConPath();
                        });
                    }else if(info.simStatus == "modem_imsi_waitnck"  || info.simStatus == "modem_waitpin"|| info.simStatus == "modem_waitpuk") {
                        showPromptNoImg("locked_simcard_jump_login",function(){
                            redirectNoConPath();
                        });
                    } else {
                        if(info.ppp_dial_conn_fail_counter == '0' || info.ppp_dial_conn_fail_counter == ''){
                            showPromptNoImg("no_connect_jump_login",function(){
                                redirectNoConPath();
                            });
                        } else {
                            showPromptNoImg("connect_failed_jump_login",function(){
                                redirectNoConPath();
                            });
                        }
                    }
                }
            } else if(window.location.href.indexOf("?flow_beyond") != -1){
                showPromptNoImg("flow_beyond_jump_login",function(){
                    service.setRedirectOff({},function(data){
                        window.location.href = curentHref.slice(0,curentHref.indexOf("?flow_beyond")) + "#traffic_alert";
                    });
                });
            } else if(window.location.href.indexOf("?fota_upgrade") != -1){
                showPromptNoImg("fota_upgrade_jump_login",function(){
                    service.setRedirectOff({},function(data){
                        window.location.href = curentHref.slice(0,curentHref.indexOf("?fota_upgrade")) + "#ota_update";
                    });
                });
            }
        }

        /**
         * 初始化 ViewModel，并进行绑定
         * @method init
         */
        function init() {
            refreshCount = 0;
            homeUtil.oldUsedData = null;
            homeUtil.oldAlarmData = null;
            myChart = echarts.init($("#traffic_graphic")[0]);
            //window.onresize = myChart.resize;
            var container = $('#container')[0];
            ko.cleanNode(container);
            var vm = new HomeViewMode();
            ko.applyBindings(vm, container);
            //ko.applyBindings(new HomeViewMode(), $("#currentOpMode")[0]);
            initRedirectPath();
        }

        function bindEvent(vm){
            $('#showDetailInfo').popover({
                html: true,
                placement: 'top',
                trigger: 'focus',
                title: function () {
                    return $.i18n.prop('device_info')
                },
                content: function () {
                    return getDetailInfoContent(vm);
                }
            }).on('shown.bs.popover', function () {
                popoverShown = true;
                var scrollTopHeight = $("#topContainer").outerHeight();
                if ($(window).scrollTop() > scrollTopHeight) {
                    $(window).scrollTop(scrollTopHeight);
                }
            }).on('hidden.bs.popover', function () {
                popoverShown = false;
            });
        }

        return {
            init: init,
            initRedirectPath:initRedirectPath,
            homeUtil:homeUtil,
            fetchDeviceInfo:fetchDeviceInfo,
            getDetailInfoContent:getDetailInfoContent,
            popoverShown:popoverShown,
            bindEvent:bindEvent
        };
    });
