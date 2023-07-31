#include "esp_gap_ble_api.h"
#include "esp_bt.h"

#define ESP_BT_ADDR_LEN 6

void setup_ble_advertising() {
    esp_ble_adv_data_t adv_data;
    uint8_t esp32_mac_address[ESP_BT_ADDR_LEN];

    // ESP32의 MAC 주소 가져오기
    esp_read_mac(esp32_mac_address, ESP_MAC_BT);

    // Advertising 데이터 초기화
    memset(&adv_data, 0, sizeof(esp_ble_adv_data_t));

    // Manufacturer Data를 사용하여 MAC 주소를 Advertising 패킷에 포함시킴
    uint8_t manufacturer_data[ESP_BT_ADDR_LEN + 2]; // 2 추가 바이트는 제조사 식별 번호
    manufacturer_data[0] = 0xFF; // 제조사 식별 번호
    manufacturer_data[1] = 0xFF; // 제조사 식별 번호
    memcpy(&manufacturer_data[2], esp32_mac_address, ESP_BT_ADDR_LEN);

    adv_data.set_scan_rsp = false;
    adv_data.include_name = true;
    adv_data.include_txpower = true;
    adv_data.min_interval = 0x20; // Advertising 주기 (20ms 단위)
    adv_data.max_interval = 0x40; // Advertising 주기 (20ms 단위)
    adv_data.appearance = 0x00;
    adv_data.manufacturer_len = ESP_BT_ADDR_LEN + 2; // 2 추가 바이트는 제조사 식별 번호 포함
    adv_data.p_manufacturer_data = manufacturer_data;

    // Advertising 데이터 설정
    esp_ble_gap_config_adv_data(&adv_data);
}
