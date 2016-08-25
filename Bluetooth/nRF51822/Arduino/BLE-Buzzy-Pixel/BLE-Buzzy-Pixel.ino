// Import libraries (BLEPeripheral depends on SPI)
#include <SPI.h>
#include <BLEPeripheral.h>
#include <Adafruit_NeoPixel.h>

#include "config.h"

// Create NeoPixel strip from parameters in config.h.
Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

// Create peripheral instance, see pinouts in config.h
BLEPeripheral            blePeripheral        = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// uuid's can be:
//   16-bit: "ffff"
//  128-bit: "19b10010e8f2537e4f6cd104768a1214" (dashed format also supported)

// create service
BLEService               bleBuzzService           = BLEService("0318e986-54b5-11e6-beb8-9e71128cae77");

// create switch and button characteristic and one or more descriptors (optional)
BLECharacteristic    pushStatusCharacteristic = BLECharacteristic("0318ef80-54b5-11e6-beb8-9e71128cae77", BLERead | BLEWrite, BUF_LEN);
BLEDescriptor pushStatusDescriptor = BLEDescriptor("2901", "Push LED Status");

BLECharCharacteristic    readStatusCharacteristic = BLECharCharacteristic("0318f084-54b5-11e6-beb8-9e71128cae77", BLERead | BLENotify);
BLEDescriptor readStatusDescriptor = BLEDescriptor("2901", "Read-BLE-Device-Status");

const unsigned char initialStatus[BUF_LEN] = {0x01,0x01,0x01,0x01,0x01,0x01,0x01};
int currentState;
int debounceState;
int buttonState = 0;
int selfLED = 4; //TODO: Move to config.h

void setup() {
  Serial.begin(9600);

  // set  button pin to input mode
  pinMode(BUTTON_PIN, INPUT);

   // Initialize NeoPixels.
  strip.begin();
  strip.show();

  // set advertised name and service
  blePeripheral.setDeviceName("BLE-Buzzy-Pixel");
  blePeripheral.setLocalName("BLE-Buzzy-Pixel");
  blePeripheral.setAdvertisedServiceUuid(bleBuzzService.uuid());

  // add service and characteristics
  blePeripheral.addAttribute(bleBuzzService);
  blePeripheral.addAttribute(pushStatusCharacteristic);
  blePeripheral.addAttribute(pushStatusDescriptor);
  blePeripheral.addAttribute(readStatusCharacteristic);
  blePeripheral.addAttribute(readStatusDescriptor);


  pushStatusCharacteristic.setValue(initialStatus, sizeof(initialStatus));
  readStatusCharacteristic.setValue(0);

  pushStatusCharacteristic.setEventHandler(BLEWritten, pushStatusCharacteristicWritten);

  // begin initialization
  blePeripheral.begin();

  Serial.println(F("BLE Buzz Peripheral"));
}

void loop() {
  // poll peripheral
  blePeripheral.poll();
  processButtonChange();
}

void processButtonChange() {
  // read the current button pin state
  currentState = digitalRead(BUTTON_PIN);
  delay(10);
  debounceState = digitalRead(BUTTON_PIN);

  if(currentState == debounceState) {
    if(currentState != buttonState) {
      if(currentState == LOW) {
        // button released
      } else {
         // toggle the value since the last status
        if(readStatusCharacteristic.value() == 0x00) {
          readStatusCharacteristic.setValue(0x01);
        } else {
          readStatusCharacteristic.setValue(0x00);
        }
        Serial.println("button Status");
        Serial.println(readStatusCharacteristic.value(),DEC);
        renderStatus(readStatusCharacteristic.value(), selfLED);
      }
      buttonState = currentState;
    }
  }
}

void pushStatusCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic){
  updateStatus();
}

void updateStatus(){
  //Get status array from the characteristic
  const unsigned char* status = pushStatusCharacteristic.value();
  for(int i=0;i<BUF_LEN; i++) {
    Serial.println(status[i], DEC);
    if (status[i] == 0x01) {
      Serial.println(F("LED on"));
      renderStatus(1, i);
    } else {
      Serial.println(F("LED off"));
      renderStatus(0, i);
    }
  }
}

void renderStatus(int color, int pixel){
  if (color == 0) {
     // Reset to red, off
     animatePixels(strip, 255, 0, 0, pixel);
  } else {
    // Turn neo pixel green and animate
     animatePixels(strip, 0, 255, 0, pixel);
  }

}

void animatePixels(Adafruit_NeoPixel& strip, uint8_t r, uint8_t g, uint8_t b, int pixel) {
  // Set NeoPixels Color
  strip.setPixelColor(pixel, r, g, b);
  strip.show();
  delay(100);
}


