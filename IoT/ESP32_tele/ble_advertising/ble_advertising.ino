#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define DEVICE_NAME "MyESP32" // 장치 이름 설정
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b" // 임의의 서비스 UUID 설정

void setup() {
  Serial.begin(115200);
  
  BLEDevice::init(DEVICE_NAME);
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x06);  // 장치가 스캔 될 최소 시간 (0x06 * 0.625ms)
  pAdvertising->setMinPreferred(0x12);  // 장치가 스캔 될 최대 시간 (0x12 * 0.625ms)
  
  BLEUUID uuid(SERVICE_UUID);
  BLECharacteristic characteristic(uuid, BLECharacteristic::PROPERTY_READ);
  pService->addCharacteristic(&characteristic);
  pService->start();

  pAdvertising->start();
  Serial.println("Advertising started!");
}

void loop() {
  // do nothing
}
