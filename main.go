package main

import (
	"crypto/tls"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
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

// get http://192.168.0.1/goform/goform_get_cmd_process?isTest=false&cmd=apn_interface_version%2Cwifi_coverage%2Cm_ssid_enable%2Cimei%2Cnetwork_type%2Crssi%2Crscp%2Clte_rsrp%2Cimsi%2Csim_imsi%2Ccr_version%2Cwa_version%2Chardware_version%2Cweb_version%2Cwa_inner_version%2CMAX_Access_num%2CSSID1%2CAuthMode%2CWPAPSK1_encode%2Cm_SSID%2Cm_AuthMode%2Cm_HideSSID%2Cm_WPAPSK1_encode%2Cm_MAX_Access_num%2Clan_ipaddr%2Cmac_address%2Cmsisdn%2CLocalDomain%2Cwan_ipaddr%2Cstatic_wan_ipaddr%2Cipv6_wan_ipaddr%2Cipv6_pdp_type%2Cipv6_pdp_type_ui%2Cpdp_type%2Cpdp_type_ui%2Copms_wan_mode%2Cppp_status&multi_data=1&_=1502462022036
func get() error {
	trans := &http.Transport{
		TLSClientConfig:   &tls.Config{InsecureSkipVerify: true},
		DisableKeepAlives: true,
	}
	client := &http.Client{Transport: trans}

	req, err := http.NewRequest("GET", "http://192.168.0.1/goform/goform_get_cmd_process?isTest=false&cmd=apn_interface_version%2Cwifi_coverage%2Cm_ssid_enable%2Cimei%2Cnetwork_type%2Crssi%2Crscp%2Clte_rsrp%2Cimsi%2Csim_imsi%2Ccr_version%2Cwa_version%2Chardware_version%2Cweb_version%2Cwa_inner_version%2CMAX_Access_num%2CSSID1%2CAuthMode%2CWPAPSK1_encode%2Cm_SSID%2Cm_AuthMode%2Cm_HideSSID%2Cm_WPAPSK1_encode%2Cm_MAX_Access_num%2Clan_ipaddr%2Cmac_address%2Cmsisdn%2CLocalDomain%2Cwan_ipaddr%2Cstatic_wan_ipaddr%2Cipv6_wan_ipaddr%2Cipv6_pdp_type%2Cipv6_pdp_type_ui%2Cpdp_type%2Cpdp_type_ui%2Copms_wan_mode%2Cppp_status%2CbroadcastSsidEnabled&multi_data=1&_=1502462022036", strings.NewReader(""))
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
