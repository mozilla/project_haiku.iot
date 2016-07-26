// Import libraries (BLEPeripheral depends on SPI)
#include <SPI.h>
#include <BLEPeripheral.h>
#include <Adafruit_NeoPixel.h>

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)

#define PIXEL_COUNT 5    // The number of NeoPixels connected to the board. TODO:Move to Config.h
#define PIXEL_PIN   5     // The pin connected to the input of the NeoPixels.
#define PIXEL_TYPE  NEO_GRB + NEO_KHZ800  // The type of NeoPixels, see the NeoPixel
                                          // strandtest example for more options.
// Create NeoPixel strip from above parameters.
Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

// define pins (varies per shield/board)
#define BLE_REQ     10
#define BLE_RDY     2
#define BLE_RST     9

// Button pin
#define BUTTON_PIN  6
#define BUF_LEN         5 // TODO: Move to Config.h

// create peripheral instance, see pinouts above
BLEPeripheral            blePeripheral        = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// uuid's can be:
//   16-bit: "ffff"
//  128-bit: "19b10010e8f2537e4f6cd104768a1214" (dashed format also supported)

// create service
BLEService               bleBuzzService           = BLEService("fff0");

// create switch and button characteristic and one or more descriptors (optional)
BLECharacteristic    pushStatusCharacteristic = BLECharacteristic("fff1", BLERead | BLEWrite, BUF_LEN);
BLEDescriptor pushStatusDescriptor = BLEDescriptor("2901", "Push LED Status");

BLECharCharacteristic    readStatusCharacteristic = BLECharCharacteristic("fff2", BLERead | BLENotify);
BLEDescriptor readStatusDescriptor = BLEDescriptor("2901", "Read-BLE-Device-Status");

const unsigned char initialStatus[BUF_LEN] = {0x11,0x11,0x11,0x11,0x11};
int currentState;
int debounceState;
int buttonState = 0;

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
          readStatusCharacteristic.setValue(0x11);
        } else {
          readStatusCharacteristic.setValue(0x00);
        }
        Serial.println("button Status");
        Serial.println(readStatusCharacteristic.value(),DEC);
        renderStatus(readStatusCharacteristic.value(), 0);
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
  Serial.println(sizeof(status), DEC);
    for(int i=0;i<= sizeof(status); i++) {
      Serial.println(status[i], DEC);
      if (status[i] == 0x11) {
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


