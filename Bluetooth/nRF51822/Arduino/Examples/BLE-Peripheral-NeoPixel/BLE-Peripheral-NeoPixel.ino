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

#define PIXEL_COUNT 12    // The number of NeoPixels connected to the board.

#define PIXEL_PIN   5     // The pin connected to the input of the NeoPixels.

#define PIXEL_TYPE  NEO_GRB + NEO_KHZ800  // The type of NeoPixels, see the NeoPixel
                                          // strandtest example for more options.

// Create NeoPixel strip from above parameters.
Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

// define pins (varies per shield/board)
#define BLE_REQ     10
#define BLE_RDY     2
#define BLE_RST     9

// LED and button pin
//#define LED_PIN     3
#define BUTTON_PIN  6

// create peripheral instance, see pinouts above
BLEPeripheral            blePeripheral        = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// create service
BLEService               ledService           = BLEService("19b10010e8f2537e4f6cd104768a1214");

// create switch and button characteristic
BLECharCharacteristic    ledCharacteristic = BLECharCharacteristic("19b10011e8f2537e4f6cd104768a1214", BLERead | BLEWrite);
BLECharCharacteristic    buttonCharacteristic = BLECharCharacteristic("19b10012e8f2537e4f6cd104768a1214", BLERead | BLENotify);

void setup() {
  Serial.begin(9600);
#if defined (__AVR_ATmega32U4__)
  delay(5000);  //5 seconds delay for enabling to see the start up comments on the serial board
#endif

  // set LED pin to output mode, button pin to input mode
  //pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);

   // Initialize NeoPixels.
  strip.begin();
  strip.show();

  // set advertised local name and service UUID
  blePeripheral.setLocalName("LED Button");
  blePeripheral.setAdvertisedServiceUuid(ledService.uuid());

  // add service and characteristics
  blePeripheral.addAttribute(ledService);
  blePeripheral.addAttribute(ledCharacteristic);
  blePeripheral.addAttribute(buttonCharacteristic);
  ledCharacteristic.setValue(0);
  buttonCharacteristic.setValue(0);

  // begin initialization
  blePeripheral.begin();

  Serial.println(F("BLE LED button Peripheral"));
}


void animatePixels(Adafruit_NeoPixel& strip, uint8_t r, uint8_t g, uint8_t b, int periodMS) {
  // Animate the NeoPixels with a simple theater chase/marquee animation.
  // Must provide a NeoPixel object, a color, and a period (in milliseconds) that controls how
  // long an animation frame will last.
  // First determine if it's an odd or even period.
  int mode = millis()/periodMS % 2;
  // Now light all the pixels and set odd and even pixels to different colors.
  // By alternating the odd/even pixel colors they'll appear to march along the strip.
  for (int i = 0; i < strip.numPixels(); ++i) {
    if (i%2 == mode) {
      strip.setPixelColor(i, r, g, b);  // Full bright color.
    }
    else {
      strip.setPixelColor(i, r/4, g/4, b/4);  // Quarter intensity color.
    }
  }
  strip.show();
}


void loop() {
  // poll peripheral
  blePeripheral.poll();

  // read the current button pin state
  char buttonValue = digitalRead(BUTTON_PIN);


  // has the value changed since the last read
  bool buttonChanged = (buttonCharacteristic.value() != buttonValue);

  if (buttonChanged) {
    Serial.println("button changed");
    Serial.println(buttonChanged, DEC);
    Serial.println("button value");
    Serial.println(buttonValue, DEC);
    Serial.println("button char");
    Serial.println(buttonCharacteristic.value(), DEC);
    Serial.println("LED char");
    Serial.println(ledCharacteristic.value(), DEC);
    // button state changed, update characteristics
    ledCharacteristic.setValue(buttonValue);
    buttonCharacteristic.setValue(buttonValue);
  }

  if (ledCharacteristic.written() || buttonChanged) {
    // update LED, either central has written to characteristic or button state has changed
    Serial.println("LED wriiten char");
    Serial.println(ledCharacteristic.value(), DEC);
    if (ledCharacteristic.value()) {
      Serial.println(F("LED on"));
      //digitalWrite(LED_PIN, HIGH);
      // Turn neo pixel light green and animate
      animatePixels(strip, 223, 10, 255, 300);
    } else {
      Serial.println(F("LED off"));
      //digitalWrite(LED_PIN, LOW);
      // Reset back to black
      animatePixels(strip, 0, 0, 0, 300);
    }
  }
}
