/**
 * 参数配置
 * @module config
 * @class config
 */
define(function() {
	var config = {
        IS_TEST: zte_web_ui_is_test, //配置是否是模拟数据
		HAS_LOGIN:true,//是否有登录页面
        LOGIN_THEN_CHECK_PIN: true, //是否先登录后验证PIN，PUK
		defaultRoute : '#login',
        LOGIN_SECURITY_SUPPORT: true, //是否支持登录安全
        MAX_LOGIN_COUNT: 5,//最大登录次数，密码输入错误次数到了以后会账户冻结一定时间
        GUEST_HASH: ['#httpshare_guest'],
        INCLUDE_MOBILE: true,
		//DEVICE: 'cpe/MF283p',
        DEVICE: 'ufi/mf79s1',
		PASSWORD_ENCODE: true,//登录密码和WIFI密码是否加密
        EMPTY_APN_SUPPORT: false,//是否支持空apn
        FAST_BOOT_SUPPORT: false, //是否支持快速开机
        HAS_STK: true, //是否有stk功能
		HAS_CASCADE_SMS: true,//是否支持级联短信
		HAS_FOTA: true,//是否支持FOTA
		HAS_MULTI_SSID: false,//多ssid功能
        HAS_WIFI: true,  //是否包含wifi功能
        HAS_BATTERY: true, //是否有电池
        SHOW_MAC_ADDRESS: false, //是否显示mac地址
        IPV6_SUPPORT: true, //是否支持ipv6
        IPV4V6_SUPPORT: true, //是否支持ipv4v6。 IPV4V6_SUPPORT和IPV4_AND_V6_SUPPORT不可同时为true.单PDP双栈
        IPV4_AND_V6_SUPPORT: false, //是否支持IPv4 & v6。 双PDP双栈
        CLEAR_DATA_SUPPORT: false, //是否支持流量和时间清空功能
        USE_IPV6_INTERFACE:true,//使用IPV6相关新接口。使用方法，例如使用MF92时，设置为false。
        MAX_STATION_NUMBER: 14, //CPE WIFI最大连接数为32
        NETWORK_UNLOCK_SUPPORT:true,//是否支持解锁
        WIFI_BAND_SUPPORT: false, //是否支持wifi频段设置
        WIFI_BANDWIDTH_SUPPORT: false, //是否支持频带宽度
        WIFI_SUPPORT_QR_CODE: true, //是否支持wifi二维码显示,新立MDM9x15、MDM9x25、MTK平台uFi项目上，默认支持WiFi二维码。
        WIFI_SWITCH_SUPPORT: true, //是否支持wifi开关
        WIFI_SLEEP_SUPPORT: true, // 是否支持wifi休眠
        AUTO_POWER_SAVE_SUPPORT: true, // 是否支持wifi自动省电
        SHOW_WIFI_AP_ISOLATED: false, // 是否显示AP隔离
        STATION_BLOCK_SUPPORT: false, // 已连接设备是否支持Block功能
        STATION_BIND_SUPPORT: false, // 已连接设备是否支持Bind功能
        UPGRADE_TYPE:"FOTA",//取值有"NONE","OTA","FOTA","TWO_PORTION"
        ALREADY_NOTICE:false,//是否已经提醒，有在线升级信息
        HAS_OTA_NEW_VERSION:false,//是否有OTA升级的新版本
        ALREADY_OTA_NOTICE:false,//是否OTA升级提醒过
        AP_STATION_SUPPORT:true,//是否支持AP Station功能
        AP_STATION_LIST_LENGTH:10,
        TSW_SUPPORT: false, // 是否支持定时休眠唤醒
        HAS_PHONEBOOK:true,//是否有电话本功能
        HAS_SMS:true,//是否有短信功能
        SMS_DATABASE_SORT_SUPPORT: true,//短信是否支持DB排序
        SHOW_UN_COMPLETE_CONCAT_SMS: true,//级联短信未接收完是否显示相关级联短信
        SMS_UNREAD_NUM_INCLUDE_SIM: false,//未读短息数量是否包含SIM侧
        SMS_SET_READ_WHEN_COMPLETE: false,//PX-877 聊天过程中，级联短信只有接受完成后才能自动设置为已读
        SD_CARD_SUPPORT: false,//是否支持SD卡
        WEBUI_TITLE: '4G Hostless Modem', //title配置, 具体参考各设备下的配置
        //modem_main_state的临时状态，一般需要界面轮询等待
        TEMPORARY_MODEM_MAIN_STATE:["modem_undetected", "modem_detected", "modem_sim_state", "modem_handover", "modem_imsi_lock", "modem_online", "modem_offline"],
        SHOW_APN_DNS:false,//APN设置页面是否显示DNS，不显示则dnsMode默认设置为auto
        HAS_PARENTAL_CONTROL: true, // 是否支持家长控制功能,
        WIFI_HAS_5G:true,
        AC_MODE_SUPPORT:true,
        CONTENT_MODIFIED:{
            modified:false,
            message:'leave_page_info',
            data:{},
            checkChangMethod:function () {
                return false;
            },
            callback:{ok:$.noop, no:function () {
                return true;
            }}//如果no返回true,页面则保持原状
        }, //当前页面内容是否已经修改

        resetContentModifyValue:function () {
            this.CONTENT_MODIFIED.checkChangMethod = function () {
                return false;
            };
            this.CONTENT_MODIFIED.modified = false;
            this.CONTENT_MODIFIED.message = 'leave_page_info';
            this.CONTENT_MODIFIED.callback = {ok:$.noop, no:function () {
                return true;
            }};//如果no返回true,页面则保持原状
            this.CONTENT_MODIFIED.data = {};
        },

        /**
         * 端口转发最大规则数
         * @attribute {Integer} portForwardMax
         */
        portForwardMax: 10,
		/*
		 *URL filter最大规则数
		 *
		*/
		urlFilterMax: 10,
		
        /**
         * 出厂设置默认APN的个数
         * @attribute {Integer} defaultApnSize
         */
        defaultApnSize:1,
        /**
         * 最大APN个数
         * @attribute {Integer} maxApnNumber
         */
        maxApnNumber: 10,
		NETWORK_MODES : [ {
			name : '802.11 b/g/n',
			value : '4'
		}, {
			name : '802.11 n only',
			value : '2'
		} ],
		NETWORK_MODES_BAND : [ {
			name : '802.11 a/n',
			value : '4'
		} ],
        NETWORK_MODES_AC : [ {
            name : '802.11 a only',
            value : '5'
        }, {
            name : '802.11 n only',
            value : '2'
        }, {
            name : '802.11 a/n',
            value : '4'
        }, {
            name : '802.11 a/n/ac',
            value : '6'
        }  ],
        KEY_ID_MODES : [  {
            name: 'Key 1',
            value: '0'
        }, {
            name : 'Key 2',
            value : '1'
        }, {
            name : 'Key 3',
            value : '2'
        }, {
            name : 'Key 4',
            value : '3'
        } ],
        ENCRYPT_TYPE_MODES : [  {
            name: 'NO ENCRYPTION',
            value: 'NONE'
        }, {
            name : 'WEP',
            value : 'WEP'
        } ],
    	AUTH_MODES : [  {
        	name: 'NO ENCRYPTION',
        	value: 'OPEN'
        }, {
            name : 'WPA2(AES)-PSK',
            value : 'WPA2PSK'
        },{
        	name : 'WPA-PSK/WPA2-PSK',
        	value : 'WPAPSKWPA2PSK'
        } ],
        AUTH_MODES_ALL : [  {
            name: 'NO ENCRYPTION',
            value: 'OPEN'
        }, {
            name : 'SHARED',
            value : 'SHARED'
        }, /**{
            name : 'WPA-PSK',
            value : 'WPAPSK'
        },**/ {
            name : 'WPA2-PSK',
            value : 'WPA2PSK'
        }, {
            name : 'WPA-PSK/WPA2-PSK',
            value : 'WPAPSKWPA2PSK'
        } ],

        LANGUAGES: [ { 
        	name: 'English',
        	value: 'en'
        }, {
    		name: '中文',
        	value: 'zh-cn'
        } ],
        
        AUTO_MODES: [ {
        	name: 'Automatic',
        	value: 'WCDMA_preferred'
        }, {
        	name: '3G Only',
        	value: 'Only_WCDMA'
        }, {
        	name: '2G Only',
        	value: 'Only_GSM'
        } ],
		APN_AUTH_MODES : [ {
			name : "NONE",
			value : "none"
		}, {
			name : "CHAP",
			value : "chap"
		}, {
			name : "PAP",
			value : "pap"
		} ],
        SMS_VALIDITY: [ {
            name: '12 hours',
            value: 'twelve_hours'
        }, {
            name: 'A day',
            value: 'one_day'
        }, {
            name: 'A week',
            value: 'one_week'
        }, {
            name: 'The longest period',
            value: 'largest'
        }],
        SLEEP_MODES : [ {
            name : "Always on",
            value : "-1"
        }, {
            name : "5 minutes",
            value : "5"
        }, {
            name : "10 minutes",
            value : "10"
        }, {
            name : "20 minutes",
            value : "20"
        }, {
            name : "30 minutes",
            value : "30"
        }, {
            name : "1 hour",
            value : "60"
        }, {
            name : "2 hours",
            value : "120"
        } ],

        FORWARD_PROTOCOL_MODES: [ {
            name : "TCP+UDP",
            value : "TCP&UDP"
        }, {
            name : "TCP",
            value : "TCP"
        }, {
            name : "UDP",
            value : "UDP"
        }],

        MAP_PROTOCOL_MODES: [ {
            name : "TCP+UDP",
            value : "TCP&UDP"
        }, {
            name : "TCP",
            value : "TCP"
        }, {
            name : "UDP",
            value : "UDP"
        }],

        FILTER_PROTOCOL_MODES: [ {
            name : "NONE",
            value : "None"
        }, {
            name : "TCP",
            value : "TCP"
        }, {
            name : "UDP",
            value : "UDP"
        }, {
            name : "ICMP",
            value : "ICMP"
        }],

        SD_SHARE_ENABLE: [ {
            name : "Enable",
            value : "1"
        }, {
            name : "Disable",
            value : "0"
        }],

        SD_FILE_TO_SHARE: [ {
            name : "entire_sd_card",
            value : "1"
        }, {
            name : "custom_setting",
            value : "0"
        }],

        SD_ACCESS_TYPE: [ {
            name : "entire_sd_card",
            value : "1"
        }, {
            name : "custom_setting",
            value : "0"
        }],

        DLNA_LANGUAGES: [ {
            name: 'english',
            value: 'english'
        }, {
            name: 'chinese',
            value: 'chinese'
        } ],
        
    	/**
    	 * SD 卡根目录
    	 * @attribute {String} SD_BASE_PATH 
    	 */
        SD_BASE_PATH: '/mmc2',

    	/**
    	 * 数据库中全部的短消息
    	 * @attribute {Array} dbMsgs 
    	 */
    	dbMsgs : [],
    	/**
    	 * 经解析关联后的所有短消息
    	 * @attribute {Array} listMsgs 
    	 */
    	listMsgs : [],

    	/**
    	 * 当前聊天对象的手机号
    	 * @attribute {String} currentChatObject 
    	 */
    	currentChatObject: null,
    	/**
    	 * 短消息最大编号
    	 * @attribute {Integer} maxId 
    	 */
    	smsMaxId : 0,
    	/**
    	 *  电话本记录 
    	 * @attribute {Array} phonebook  
    	 * */
    	phonebook : [],
        /**
         *  缓存短信初始化状态
         * @attribute {Boolean} smsIsReady
         * */
        smsIsReady: false,
        /**
         * 国家码所述类型
         * @attribute {JSON} defaultApnSize
         * @example
         * 2412-2462   1
		 * 2467-2472   2
		 * 2312-2372   4
         */
        countryCodeType : {
        	world: 3,
        	mkkc: 3,
        	apld: 7,
        	etsic: 3,
        	fcca: 1
        },
        
        /**
         * 国家码与类型匹配表
         * @attribute {Map} countryCode
         */
        countryCode : {
			world : [ "AL", "DZ", "AR", "AM", "AU", "AT", "AZ", "BH", "BY",
					"BE", "BA", "BR", "BN", "BG", "CL", "CN", "CR", "HR", "CY",
					"CZ", "DK", "EC", "EG", "SV", "EE", "FI", "FR", "F2", "GE",
					"DE", "GR", "HN", "HK", "HU", "IS", "IN", "ID", "IE",
					"IL", "IT", "JM", "JO", "KZ", "KE", "KR", "KW", "LV",
					"LB", "LI", "LT", "LU", "MO", "MK", "MY", "MT", "MC", "MA",
					"NL", "AN", "NO", "OM", "PK", "PE", "PH", "PL", "PT", "QA",
					"RO", "RU", "SA", "CS", "SG", "SK", "SI", "ZA", "ES", "LK",
					"SE", "CH", "SY", "TH", "TT", "TN", "TR", "UA", "AE", "GB",
                "UY", "VN", "YE", "ZW", "BD"],
			mkkc : [ "JP" ],
			apld : [],
			etsic : [ "BZ", "BO", "NZ", "VE" ],
			fcca : [ "CA", "CO", "DO", "GT", "MX", "PA", "PR", "TW", "US", "UZ" ]
        },
        countryCode_5g: {
            //88 countries of world【36 40 44 48】
            one: {
                codes: [ "AL", "AI", "AW", "AT", "BY", "BM", "BA", "BW", "IO", "BG",
                    "CV", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GF", "PF",
                    "TF", "GI", "DE", "GR", "GP", "GG", "HU", "IS", "IE", "IT",
                    "KE", "LA", "LV", "LS", "LI", "LT", "LU", "MK", "MT", "IM",
                    "MQ", "MR", "MU", "YT", "MC", "ME", "MS", "NL", "AN", "NO",
                    "OM", "PL", "PT", "RE", "RO", "SM", "SN", "RS", "SK", "SI",
                    "ZA", "ES", "SE", "CH", "TC", "UG", "GB", "VG", "WF", "ZM",
                    "AF", "JO", "MA", "EH", "EU", "DZ", "IL", "MX", "PM", "TN",
                    "TR", "JP" ],
                channels: [36, 40, 44, 48]},
            //60 countrys of world【36 40 44 48 149 153 157 161 165】
            two: {
                codes: [ "AS", "AG", "AZ", "BR", "KH", "KY", "CO", "CR", "DM", "DO",
                    "EC", "GH", "GD", "HK", "KZ", "KI", "FM", "MZ", "NA", "NZ",
                    "NI", "NE", "PW", "PE", "PH", "PR", "VC", "TH", "TT", "UY",
                    "ZW", "AU", "BH", "BB", "CA", "CL", "CX", "EG", "SV", "GT",
                    "HT", "IN", "MY", "NF", "PA", "PG", "SG", "US", "VN" ],
                channels: [36, 40, 44, 48, 149, 153, 157, 161, 165]},
            //9 countrys of world【149 153 157 161】
            three: {
                codes: ["KR", "LB", "MW", "MO", "QA"],
                channels: [149, 153, 157, 161]},
            //12 countrys of world【149 153 157 161 165】
            four: {
                codes: [ "BD", "BF", "CN", "HN", "JM", "PK", "PY", "KN", "AR", "TW", "NG" ],
                channels: [149, 153, 157, 161, 165]},
            //1 country of world【36 40 44 48 149 153 157 161】
            five: {
                codes: [ "SA" ],
                channels: [36, 40, 44, 48, 149, 153, 157, 161]}
		}, 

        /**
         * 国家码与语言匹配表
         * @attribute {Map} countries
         */
		countries : {
			NONE : "NONE",
			AL : "SHQIPERI",
			DZ : "الجزائر",
			AR : "ARGENTINA",
			AM : "ՀԱՅԱՍՏԱՆ",
			AU : "AUSTRALIA",
			AT : "ÖSTERREICH",
			AZ : "AZƏRBAYCAN",
            BD: "বাংলাদেশ",
			BH : "البحرين",
			BY : "БЕЛАРУСЬ",
			BE : "BELGIË",
			BA : "БОСНА И ХЕРЦЕГОВИНА",
			BR : "BRASIL",
			BN : "BRUNEI DARUSSALAM",
			BG : "БЪЛГАРИЯ",
			CL : "CHILE",
			CN : "中国",
			CR : "COSTA RICA",
			HR : "HRVATSKA",
			CY : "ΚΎΠΡΟΣ",
			CZ : "ČESKÁ REPUBLIKA",
			DK : "DANMARK",
			EC : "ECUADOR",
			EG : "مصر",
			SV : "EL SALVADOR",
			EE : "EESTI",
			FI : "SUOMI",
			FR : "FRANCE",
			F2 : "FRANCE RESERVES",
			GE : "საქართველო",
			DE : "DEUTSCHLAND",
			GR : "ΕΛΛΆΔΑ",
			HN : "HONDURAS",
			HK : "香港",
			HU : "MAGYARORSZÁG",
			IS : "ÍSLAND",
			IN : "INDIA",
			ID : "INDONESIA",
			IE : "ÉIRE",
			IL : "إسرائيل",
			IT : "ITALIA",
			JM : "JAMAICA",
			JO : "الأردن",
			KZ : "КАЗАХСТАН",
			KE : "KENYA",
			KR : "한국 ROK",
			K3 : "한국 ROC3",
			KW : "الكويت",
			LV : "LATVIJA",
			LB : "لبنان",
			LI : "LIECHTENSTEIN",
			LT : "LIETUVA",
			LU : "LUXEMBOURG",
			MO : "澳門",
			MK : "МАКЕДОНИЈА",
			MY : "MALAYSIA",
			MT : "MALTA",
			MC : "MONACO",
			MA : "المغرب",
			NL : "NEDERLAND",
            AN: "NETHERLANDS ANTILLES",
			NO : "NORGE",
			OM : "سلطنة عمان",
			PK : "PAKISTAN",
			PE : "PERÚ",
			PH : "PHILIPPINES",
			PL : "POLSKA",
			PT : "PORTUGAL",
			QA : "قطر",
			RO : "ROMÂNIA",
            RU: "Российская Федерация",
			SA : "السعودية",
			CS : "Црна Гора",
			SG : "SINGAPORE",
			SK : "SLOVENSKÁ REPUBLIKA",
			SI : "SLOVENIJA",
			ZA : "SOUTH AFRICA",
			ES : "ESPAÑA",
			LK : "SRILANKA",
			SE : "SVERIGE",
			CH : "SCHWEIZ",
			TH : "ประเทศไทย",
			TT : "TRINIDAD AND TOBAGO",
			TN : "تونس",
			TR : "TÜRKİYE",
			UA : "Україна",
			AE : "الإمارات العربية المتحدة",
			GB : "UNITED KINGDOM",
			UY : "URUGUAY",
			VN : "VIỆT NAM",
			YE : "اليمن",
			ZW : "ZIMBABWE",
			JP : "日本",
			K2 : "한국 ROC2",
			BZ : "BELIZE",
			BO : "BOLIVIA",
			NZ : "NEW ZEALAND",
            VE: "REPÚBLICA BOLIVARIANA DE VENEZUELA",
			CA : "CANADA",
			CO : "COLOMBIA",
			DO : "REPÚBLICA DOMINICANA",
			GT : "GUATEMALA",
			MX : "MEXICO",
			PA : "PANAMÁ",
			PR : "PUERTO RICO",
			TW : "台灣",
			US : "UNITED STATES",
			UZ : "O’zbekiston"
		},
		countries_5g : {
			NONE : "NONE",
			AR : "ARGENTINA",
			AM : "ՀԱՅԱՍՏԱՆ",
			AU : "AUSTRALIA",
			AT : "ÖSTERREICH",
			AZ : "AZƏRBAYCAN",
			BH : "البحرين",
			BY : "БЕЛАРУСЬ",
			BE : "BELGIË",
			BA : "БОСНА И ХЕРЦЕГОВИНА",
			BR : "BRASIL",
			BN : "BRUNEI DARUSSALAM",
			BG : "БЪЛГАРИЯ",
			CL : "CHILE",
			CN : "中国",
			CR : "COSTA RICA",
			HR : "HRVATSKA",
			CY : "ΚΎΠΡΟΣ",
			CZ : "ČESKÁ REPUBLIKA",
			DK : "DANMARK",
			EC : "ECUADOR",
			EG : "مصر",
			SV : "EL SALVADOR",
			EE : "EESTI",
			FI : "SUOMI",
			FR : "FRANCE",
			F2 : "FRANCE RESERVES",
			GE : "საქართველო",
			DE : "DEUTSCHLAND",
			GR : "ΕΛΛΆΔΑ",
			HK : "香港",
			HU : "MAGYARORSZÁG",
			IS : "ÍSLAND",
			IN : "INDIA",
			ID : "INDONESIA",
			IE : "ÉIRE",
			IL : "إسرائيل",
			IT : "ITALIA",
			JM : "JAMAICA",
			JO : "الأردن",
			KR : "한국 ROK",
			K3 : "한국 ROC3",
			LV : "LATVIJA",
			LI : "LIECHTENSTEIN",
			LT : "LIETUVA",
			LU : "LUXEMBOURG",
			MO : "澳門",
			MY : "MALAYSIA",
			MT : "MALTA",
			MC : "MONACO",
			NL : "NEDERLAND",
			AN : "Netherlands Antilles",
			NO : "NORGE",
			OM : "سلطنة عمان",
			PE : "PERÚ",
			PH : "PHILIPPINES",
			PL : "POLSKA",
			PT : "PORTUGAL",
			SA : "السعودية",
			CS : "Црна Гора",
			SG : "SINGAPORE",
			SK : "SLOVENSKÁ REPUBLIKA",
			SI : "SLOVENIJA",
			ZA : "SOUTH AFRICA",
			ES : "ESPAÑA",
			LK : "SRILANKA",
			SE : "SVERIGE",
			CH : "SCHWEIZ",
			TT : "TRINIDAD AND TOBAGO",
			TN : "تونس",
			TR : "TÜRKİYE",
			GB : "UNITED KINGDOM",
			UY : "URUGUAY",
			JP : "日本",
			K2 : "한국 ROC2",
			BZ : "BELIZE",
			BO : "BOLIVIA",
			NZ : "NEW ZEALAND",
			VE : "VENEZUELA",
			CA : "CANADA",
			CO : "COLOMBIA",
			DO : "REPÚBLICA DOMINICANA",
			GT : "GUATEMALA",
			MX : "MEXICO",
			PA : "PANAMÁ",
			PR : "PUERTO RICO",
			TW : "台灣",
			US : "UNITED STATES",
			UZ : "O’zbekiston"
		},
		pppoeModes: [{
			name : "PPPoE",
			value : "PPPOE"
		}, {
			name : "Static",
			value : "STATIC"
		}, {
			name : "DHCP",
			value : "DHCP"
		}],
		sntpTimeSetMode : [{
			name: 'manual',
			value: 'manual'
		}, {
			name: 'auto',
			value: 'auto'
		}],
		timeZone : [{
			name: "GMT-12:00",
			value: "-12"
		}, {
			name: "GMT-11:00",
			value: "-11"
		}, {
			name: "GMT-10:00",
			value: "-10"
		}, {
			name: "GMT-09:00",
			value: "-9"
		}, {
			name: "GMT-08:00",
			value: "-8"
		}, {
			name: "GMT-07:00",
			value: "-7"
		}, {
			name: "GMT-06:00",
			value: "-6"
		}, {
			name: "GMT-05:00",
			value: "-5"
		}, {
			name: "GMT-04:30",
			value: "-4.5"
		}, {
			name: "GMT-04:00",
			value: "-4"
		}, {
			name: "GMT-03:30",
			value: "-3.5"
		}, {
			name: "GMT-03:00",
			value: "-3"
		}, {
			name: "GMT-02:00",
			value: "-2"
		}, {
			name: "GMT-01:00",
			value: "-1"
		}, {
			name: "GMT",
			value: "0"
		}, {
			name: "GMT+01:00",
			value: "1"
		}, {
			name: "GMT+02:00",
			value: "2"
		}, {
			name: "GMT+03:00",
			value: "3"
		}, {
			name: "GMT+03:30",
			value: "3.5"
		}, {
			name: "GMT+04:00",
			value: "4"
		}, {
			name: "GMT+04:30",
			value: "4.5"
		}, {
			name: "GMT+05:00",
			value: "5"
		}, {
			name: "GMT+05:30",
			value: "5.5"
		}, {
			name: "GMT+05:45",
			value: "5.75"
		}, {
			name: "GMT+06:00",
			value: "6"
		}, {
			name: "GMT+06:30",
			value: "6.5"
		}, {
			name: "GMT+07:00",
			value: "7"
		}, {
			name: "GMT+08:00",
			value: "8"
		}, {
			name: "GMT+09:00",
			value: "9"
		}, {
			name: "GMT+09:30",
			value: "9.5"
		}, {
			name: "GMT+10:00",
			value: "10"
		}, {
			name: "GMT+11:00",
			value: "11"
		}, {
			name: "GMT+12:00",
			value: "12"
		}, {
			name: "GMT+13:00",
			value: "13"
		}],
		daylightSave : [{
			name: "Disable",
			value: "0"
		}, {
			name: "Enable",
			value: "1"
		}],
		wdsModes : [{
			name: "Disable",
			value: "0"
		}, {
			name: "RootAP Mode",
			value: "1"
		}, {
			name: "Bridge Mode",
			value: "2"
		}, {
			name: "Repeater Mode",
			value: "3"
		}],
        voipSipDtmfMethod : [
            {
                name : 'InBand',
                value : '2'
            },
            {
                name : 'RFC2833',
                value : '3'
            },
            {
                name : 'SIPInfo',
                value : '4'
            }
        ],
        sipEncodeMethod : [
            {
                name : 'G.711 u-Law',
                value : '0'
            },
            {
                name : 'G.711 a-Law',
                value : '1'
            },
            {
                name : 'G.722',
                value : '2'
            },
            {
                name : 'G.729',
                value : '3'
            },
            {
                name : 'G.726-16kps',
                value : '4'
            },
            {
                name : 'G.726-24kps',
                value : '5'
            },
            {
                name : 'G.726-32kps',
                value : '6'
            },
            {
                name : 'G.726-40kps',
                value : '7'
            }
        ],
        FORWARDING_MODES : [
            {
                name : 'Unconditional forwarding',
                value : '1'
            },
            {
                name : 'When busy',
                value : '2'
            },
            {
                name : 'When no answer',
                value : '3'
            },
            {
                name : 'Cancel all forwarding',
                value : '0'
            }
        ],
        TIME_UNITS: [ {
            name: 'hour',
            value: '60'
        }, {
            name: 'Minutes',
            value: '1'
        }]
	};

    require(['config/' + config.DEVICE + '/config'], function(otherConf) {
        $.extend(config, otherConf);
    });

	return config;
});