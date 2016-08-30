#ifndef INC_BLEBUZZYPIXEL_CONFIG_H
#define INC_BLEBUZZYPIXEL_CONFIG_H

// This device ID should be unique to help distinguish multiple devices in the
// same area while we're doing prototyping. Just change it to some unique value
// before building.
#define DEVICE_ID "1"

// The UUID for our BLE device. UUIDs can be:
//   16-bit: "ffff"
//  128-bit: "19b10010e8f2537e4f6cd104768a1214" (dashed format also supported)
#define BLE_UUID "0318e986-54b5-11e6-beb8-9e71128cae77"

// The index of the LED representing oneself.
#define SELF_LED 0

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)

// The number of slots (including the user); each slot has an associated button
// and LED.
#define SLOT_COUNT 7

// The pin connected to the input of the NeoPixels.
#define PIXEL_PIN 5
// The type of NeoPixels, see the NeoPixel strandtest example for more options.
#define PIXEL_TYPE NEO_GRB + NEO_KHZ800

// Define pins (varies per shield/board).
#define BLE_REQ 10
#define BLE_RDY 2
#define BLE_RST 9

// Button pin.
#define BUTTON_PIN  6

#endif
