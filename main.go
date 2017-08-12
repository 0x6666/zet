package main

import (
	"crypto/tls"
	"errors"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

// post http://192.168.0.1/goform/goform_set_cmd_process
//	Form item: "isTest" = "false"
//	Form item: "goformId" = "LOGIN"
//	Form item: "password" = "YWRtaW4="
func login() error {
	values := make(url.Values)
	values.Set("isTest", "false")
	values.Set("goformId", "LOGIN")
	values.Set("password", "YWRtaW4=")

	trans := &http.Transport{
		TLSClientConfig:   &tls.Config{InsecureSkipVerify: true},
		DisableKeepAlives: true,
	}
	client := &http.Client{Transport: trans}

	req, err := http.NewRequest("POST", "http://192.168.0.1/goform/goform_set_cmd_process", strings.NewReader(values.Encode()))
	if err != nil {
		return err
	}

	req.Header.Set("Referer", "http://192.168.0.1/index.html")
	resp, err := client.Do(req)

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return errors.New("auth fail")
	}

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Printf(string(data))
	return nil
}

func RandString(length int) string {
	rand.Seed(time.Now().UnixNano())
	rs := make([]string, length)
	for start := 0; start < length; start++ {
		rs = append(rs, strconv.Itoa(rand.Intn(10)))
	}
	return strings.Join(rs, "")
}

// get http://192.168.0.1/goform/goform_get_cmd_process?isTest=false&cmd=apn_interface_version%2Cwifi_coverage%2Cm_ssid_enable%2Cimei%2Cnetwork_type%2Crssi%2Crscp%2Clte_rsrp%2Cimsi%2Csim_imsi%2Ccr_version%2Cwa_version%2Chardware_version%2Cweb_version%2Cwa_inner_version%2CMAX_Access_num%2CSSID1%2CAuthMode%2CWPAPSK1_encode%2Cm_SSID%2Cm_AuthMode%2Cm_HideSSID%2Cm_WPAPSK1_encode%2Cm_MAX_Access_num%2Clan_ipaddr%2Cmac_address%2Cmsisdn%2CLocalDomain%2Cwan_ipaddr%2Cstatic_wan_ipaddr%2Cipv6_wan_ipaddr%2Cipv6_pdp_type%2Cipv6_pdp_type_ui%2Cpdp_type%2Cpdp_type_ui%2Copms_wan_mode%2Cppp_status&multi_data=1&_=1502462022036
func get() error {
	trans := &http.Transport{
		TLSClientConfig:   &tls.Config{InsecureSkipVerify: true},
		DisableKeepAlives: true,
	}
	client := &http.Client{Transport: trans}

	cmds := []string{
		//"apn_interface_version",
		//"wifi_coverage",
		//"network_type",
		//"hardware_version",
		//"cr_version",
		//"wa_version",
		//"web_version",
		//"wa_inner_version",
		//"msisdn",
		//"LocalDomain",
		//"static_wan_ipaddr",
		//"ipv6_wan_ipaddr",
		//"ipv6_pdp_type",
		//"ipv6_pdp_type_ui",
		//"pdp_type",
		//"pdp_type_ui",
		//"opms_wan_mode",
		//"mac_address",
		//"lan_ipaddr",
		//"wan_ipaddr",
		//"MAX_Access_num",
		//"m_MAX_Access_num",
		//"imsi",
		//"new_version_state",
		//"loginfo",
		//"modem_main_state",
		//"pin_status",
		//"opms_wan_mode",
		//"current_upgrade_state",
		//"is_mandatory",
		//"wifi_dfs_status",
		//"battery_value",
		//"rssi",
		//"rscp",
		//"realtime_time",
		"imei",
		"sim_imsi",
		"lte_rsrp",          //信号强度
		"RadioOff",          //wifi 是否启用
		"HideSSID",          //是否广播wifi ssid
		"SSID1",             //wifi ssid
		"AuthMode",          //wifi 加密方式
		"WPAPSK1_encode",    //wifi 密码
		"m_SSID",            // 默认 wifi ssid
		"m_AuthMode",        // 默认wifi 加密方式
		"m_WPAPSK1_encode",  //默认wifi密码
		"realtime_tx_bytes", //发送字节
		"realtime_rx_bytes", //接收字节
		"realtime_tx_thrpt", //速度？
		"realtime_rx_thrpt", //速度？
		"monthly_rx_bytes",  //接收字节
		"monthly_tx_bytes",  //发送字节
		//"m_ssid_enable",
		//"m_HideSSID",
		//"ppp_status",
		//"spn_name_data",
		//"monthly_time",
		//"wifi_enable",
		//"wifi_5g_enable",
		//"sta_ip_status",
		//"NoForwarding",
		//"m_NoForwarding",
		//"wifi_attr_max_station_number",
		//"EncrypType",
		//"m_EncrypType",
		//"ppp_dial_conn_fail_counter",
		//"signalbar",
		//"spn_b1_flag",
		//"spn_b2_flag",
		//"network_type",
		//"network_provider",
		//"roam_setting_option",
		//"upg_roam_switch",
		//"EX_SSID1",
		//"EX_wifi_profile",
		//"simcard_roam",
		//"lan_ipaddr",
		//"station_mac",
		//"battery_charging",
		//"battery_vol_percent",
		//"battery_pers",
		//"date_month",
		//"data_volume_limit_switch",
		//"data_volume_limit_size",
		//"data_volume_alert_percent",
		//"data_volume_limit_unit",
		//"ssid",
		//"check_web_conflict",
		//"dial_mode",
		//"wifi_onoff_func_control",
		//"ppp_dial_conn_fail_counter",
	}

	url := "http://192.168.0.1/goform/goform_get_cmd_process?isTest=false&multi_data=1&_=" + RandString(13) + "&cmd="
	url += strings.Join(cmds, "%2C")

	req, err := http.NewRequest("GET", url, strings.NewReader(""))
	if err != nil {
		return err
	}

	req.Header.Set("Referer", "http://192.168.0.1/index.html")
	resp, err := client.Do(req)

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return errors.New("auth fail")
	}

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	ss := strings.Split(string(data), ",")

	for _, s := range ss {
		fmt.Println(s)
	}

	return nil
}

func main() {
	err := login()

	if err != nil {
		fmt.Printf(err.Error())
	}
	fmt.Println("")

	err = get()

	if err != nil {
		fmt.Printf(err.Error())
	}
	fmt.Println("")
}
