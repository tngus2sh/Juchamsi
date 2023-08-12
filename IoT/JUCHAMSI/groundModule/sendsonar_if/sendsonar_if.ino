#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <BLEBeacon.h>

#define DEVICE_NAME            "ESP32"
#define SERVICE_UUID           "7A0247E7-8E88-409B-A959-AB5092DDB03E"
#define BEACON_UUID            "2D7A9F0C-E0E8-4CC9-A71B-A21DB2D034A1"
#define BEACON_UUID_REV        "A134D0B2-1DA2-1BA7-C94C-E8E00C9F7A2D"
#define CHARACTERISTIC_UUID    "82258BAA-DF72-47E8-99BC-B73D7ECD08A5"
#include <esp_system.h>

const int trigPin = 13; // TRIG 핀 설정 (초음파 보내는 핀)
const int echoPin = 12; // ECHO 핀 설정 (초음파 받는 핀)

BLEServer *pServer;
BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
uint8_t value = 0;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("deviceConnected = true");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("deviceConnected = false");

      // Restart advertising to be visible and connectable again
      BLEAdvertising* pAdvertising;
      pAdvertising = pServer->getAdvertising();
      pAdvertising->start();
      Serial.println("iBeacon advertising restarted");
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();

      if (rxValue.length() > 0) {
        Serial.println("*********");
        Serial.print("Received Value: ");
        for (int i = 0; i < rxValue.length(); i++) {
          Serial.print(rxValue[i]);
        }
        Serial.println();
        Serial.println("*********");

      }
    }
};


void init_service() {
  BLEAdvertising* pAdvertising;
  pAdvertising = pServer->getAdvertising();
  pAdvertising->stop();

  // Create the BLE Service
  BLEService *pService = pServer->createService(BLEUUID(SERVICE_UUID));

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );
  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->addDescriptor(new BLE2902());

  pAdvertising->addServiceUUID(BLEUUID(SERVICE_UUID));

  // Start the service
  pService->start();

  pAdvertising->start();
}

void init_beacon() {
  BLEAdvertising* pAdvertising;
  pAdvertising = pServer->getAdvertising();
  pAdvertising->stop();
  // iBeacon
  BLEBeacon myBeacon;
  myBeacon.setManufacturerId(0x4c00);
  myBeacon.setMajor(5);
  myBeacon.setMinor(88);
  myBeacon.setSignalPower(0xc5);
  myBeacon.setProximityUUID(BLEUUID(BEACON_UUID_REV));

  BLEAdvertisementData advertisementData;
  advertisementData.setFlags(0x1A);
  advertisementData.setManufacturerData(myBeacon.getData());
  pAdvertising->setAdvertisementData(advertisementData);

  pAdvertising->start();
}

void printMacAddress() {
  esp_bd_addr_t mac;
  esp_read_mac(mac, ESP_MAC_WIFI_STA);

  Serial.print("MAC Address: ");
  for (int i = 0; i < 6; i++) {
    Serial.printf("%02X", mac[i]);
    if (i < 5) {
      Serial.print(":");
    }
  }
  Serial.println();
}

void setup() {
    Serial.begin(115200);
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    Serial.println();
    Serial.println("Initializing...");
    Serial.flush();

    BLEDevice::init(DEVICE_NAME);
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    init_service();
    init_beacon();

    Serial.println("iBeacon + service defined and advertising!");
    printMacAddress();
}

void loop() {
    long duration, distance;
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 17 / 1000;

    if(distance<30){

      // BLE Beacon 정보와 서비스를 광고하며, 연결된 디바이스에 초음파 센서의 정보도 보냅니다.
      BLEScanResults foundDevices = BLEDevice::getScan()->start(5, false);
      BLEAdvertising* pAdvertising;
      pAdvertising = pServer->getAdvertising();
      pAdvertising->stop();
      BLEBeacon myBeacon;
  
      // Minor 값에 duration 값을 설정하여 advertise
      myBeacon.setMinor(duration);
  
      // Major 값에 distance 값을 설정하여 advertise
      myBeacon.setMajor(distance);
  
      BLEAdvertisementData advertisementData;
      advertisementData.setFlags(0x1A);
      advertisementData.setManufacturerData(myBeacon.getData());
      pAdvertising->setAdvertisementData(advertisementData);

      Serial.print("Advertising Beacon with Major: ");
      Serial.print(distance);
      Serial.print(", Minor: ");
      Serial.println(duration);
  
      // 연결된 디바이스에 초음파 센서의 거리값을 전송합니다.
      if (deviceConnected) {
          pCharacteristic->notify();
      }
  
      // advertising을 다시 시작합니다.
      pAdvertising->start();
  
      // BLE 스캔 결과를 처리합니다.
      for (int i = 0; i < foundDevices.getCount(); i++) {
          BLEAdvertisedDevice device = foundDevices.getDevice(i);
      }
  
      // 스캔 결과 처리가 끝났으면, 스캔을 멈춥니다.
      BLEDevice::getScan()->stop();
    }
    delay(1000);
}
