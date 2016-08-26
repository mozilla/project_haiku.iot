// Import libraries (BLEPeripheral depends on SPI).
#include <SPI.h>
#include <BLEPeripheral.h>
#include <Adafruit_NeoPixel.h>

#include <cstring>

#include "config.h"

// Create NeoPixel strip from parameters in config.h.
Adafruit_NeoPixel strip(SLOT_COUNT, PIXEL_PIN, PIXEL_TYPE);

// Create peripheral instance, see pinouts in config.h.
BLEPeripheral blePeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// Create service.
BLEService bleBuzzService(BLE_UUID);

// Create switch and button characteristic and one or more descriptors.
BLECharacteristic pushStatusCharacteristic(
  BLE_UUID, BLERead | BLEWrite, SLOT_COUNT
);
BLEDescriptor pushStatusDescriptor("2901", "Push LED Status");

BLECharCharacteristic readStatusCharacteristic(BLE_UUID, BLERead | BLENotify);
BLEDescriptor readStatusDescriptor("2901", "Read-BLE-Device-Status");

int buttonState = 0;

void setup() {
  Serial.begin(9600);

  // Set button pin to input mode.
  pinMode(BUTTON_PIN, INPUT);

  // Initialize NeoPixels.
  strip.begin();
  strip.show();

  // Set advertised name and service.
  blePeripheral.setDeviceName("BLE-Buzzy-Pixel " DEVICE_ID);
  blePeripheral.setLocalName("BLE-Buzzy-Pixel " DEVICE_ID);
  blePeripheral.setAdvertisedServiceUuid(bleBuzzService.uuid());

  // Add service and characteristics.
  blePeripheral.addAttribute(bleBuzzService);
  blePeripheral.addAttribute(pushStatusCharacteristic);
  blePeripheral.addAttribute(pushStatusDescriptor);
  blePeripheral.addAttribute(readStatusCharacteristic);
  blePeripheral.addAttribute(readStatusDescriptor);

  unsigned char initialStatus[SLOT_COUNT];
  std::memset(initialStatus, 0x01, sizeof(initialStatus));
  pushStatusCharacteristic.setValue(initialStatus, sizeof(initialStatus));

  readStatusCharacteristic.setValue(0);

  pushStatusCharacteristic.setEventHandler(
    BLEWritten, pushStatusCharacteristicWritten
  );

  // Begin initialization.
  blePeripheral.begin();

  Serial.println(F("BLE Buzz Peripheral"));
}

void loop() {
  blePeripheral.poll();
  processButtonChange();
}

void processButtonChange() {
  // Read the current button pin state.
  int currentState = digitalRead(BUTTON_PIN);
  delay(10);
  int debounceState = digitalRead(BUTTON_PIN);

  if(currentState != debounceState) {
    return;
  }

 if(currentState != buttonState) {
   if(currentState != LOW) {
     // toggle the value since the last status
     if(readStatusCharacteristic.value() == 0x00) {
       readStatusCharacteristic.setValue(0x01);
     } else {
       readStatusCharacteristic.setValue(0x00);
     }
     Serial.println("button Status");
     Serial.println(readStatusCharacteristic.value(), DEC);
     renderStatus(readStatusCharacteristic.value(), SELF_LED);
   }
   buttonState = currentState;
 }
}

void pushStatusCharacteristicWritten(
  BLECentral& central, BLECharacteristic& characteristic
) {
  updateStatus();
}

void updateStatus() {
  // Get status array from the characteristic.
  const unsigned char* status = pushStatusCharacteristic.value();
  for(int i = 0; i != SLOT_COUNT; i++) {
    Serial.println(status[i], DEC);
    if(status[i] == 0x01) {
      Serial.println(F("LED on"));
      renderStatus(1, i);
    } else {
      Serial.println(F("LED off"));
      renderStatus(0, i);
    }
  }
}

void renderStatus(int color, int pixel){
  if(color == 0) {
    // Reset to red, off.
    animatePixels(strip, 255, 0, 0, pixel);
  } else {
    // Turn neo pixel green and animate.
    animatePixels(strip, 0, 255, 0, pixel);
  }
}

void animatePixels(Adafruit_NeoPixel& strip, uint8_t r, uint8_t g, uint8_t b,
                   int pixel) {
  // Set NeoPixels Color.
  strip.setPixelColor(pixel, r, g, b);
  strip.show();
  delay(100);
}


