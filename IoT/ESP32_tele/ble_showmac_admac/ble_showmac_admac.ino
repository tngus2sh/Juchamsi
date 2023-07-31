#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include "esp_bt_main.h"
#include "esp_bt_device.h"
#include "BluetoothSerial.h"

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

void printDeviceAddress() {

  const uint8_t* point = esp_bt_dev_get_address();
  for (int i = 0; i < 6; i++) {
    char str[3];
    sprintf(str, "%02X", (int)point[i]);
    Serial.print(str);
    if (i < 5){
      Serial.print(":");
    }
  }
}
void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");

  BLEDevice::init("KSH_ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setValue("Hello World says Neil");
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  
/* 추가 시작 */  

  // 어드버타이징 데이터 변수 선언
  BLEAdvertisementData advertisementData = BLEAdvertisementData();
  // 어드버타이징에 장치명 넣기
  advertisementData.setName("ADV Device");
  // 추가 정보용 변수
  // 앞에 두 바이트는 BLE SIG에 회원 가입 후 받게 되는 회사 코드
  // 없으니까 그냥 막 넣어도 된다.
  uint8_t payload[5] = {
    0xFF, 0xFF, 0x33, 0x44, 0x55
  };
  // manufacturerData에 playload를 추가한다.
  advertisementData.setManufacturerData(std::string(reinterpret_cast<char*>(payload), 5));

  // 어드버타이징에 어드버타이징 데이터를 추가한다.
  pAdvertising->setAdvertisementData(advertisementData);

/* 추가 끝 */

  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");
  printDeviceAddress();
  Serial.print("\n");
}

void loop() {
  delay(2000);
}
