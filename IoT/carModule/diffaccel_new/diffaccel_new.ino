#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;

void setup(void) {
  Serial.begin(115200);
  while (!Serial)
    delay(10); // will pause Zero, Leonardo, etc until serial console opens

  Serial.println("Adafruit MPU6050 test!");

  // Try to initialize!
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);

  Serial.println("");
  delay(100);
}

float prevAccelX = 0, prevAccelY = 0, prevAccelZ = 0;
void loop() {
  /* Get new sensor events with the readings */
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  float diffAccelX = abs(a.acceleration.x - prevAccelX);
  float diffAccelY = abs(a.acceleration.y - prevAccelY);
  float diffAccelZ = abs(a.acceleration.z - prevAccelZ);

  /* Print out the total difference */
  Serial.print("tot_diff: ");
  Serial.println(diffAccelX + diffAccelY + diffAccelZ);
  prevAccelX = a.acceleration.x;
  prevAccelY = a.acceleration.y;
  prevAccelZ = a.acceleration.z;

  delay(500);
}