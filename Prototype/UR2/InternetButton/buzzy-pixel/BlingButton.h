#include "application.h"

#ifndef BlingButton_h
#define BlingButton_h

// ----- Callback function types -----
extern "C" {
  typedef void (*callbackFunction)(void);
}

class BlingButton {

 public:

  BlingButton();

  void
    begin(void),
    begin(int i),
    log(String str),
    allLedsOff(void),
    allLedsOn(uint8_t r, uint8_t g, uint8_t b),
    ledOn(uint8_t i, uint8_t r, uint8_t g, uint8_t b),
    ledOff(uint8_t i),
    rainbow(uint8_t wait),
    dualColor(uint8_t r1, uint8_t g1, uint8_t b1,
      uint8_t r2, uint8_t g2, uint8_t b2, uint8_t wait),
    vibrate(int duration);
  uint8_t
    buttonOn(void);
  float
    batteryLevel(void);

  void attachClick(callbackFunction newFunction);
  void attachDoubleClick(callbackFunction newFunction);
  void attachLongPress(callbackFunction newFunction);
  void listen(void);

 private:

};

#define BLINGBTN_LOGGING_TOPIC "log"

// -----
// OneButton.h - Library for detecting button clicks, doubleclicks and long press pattern on a single button.
// This class is implemented for use with the Arduino environment.
// Copyright (c) by Matthias Hertel, http://www.mathertel.de
// This work is licensed under a BSD style license. See http://www.mathertel.de/License.aspx
// More information on: http://www.mathertel.de/Arduino
// An Arduino library for using a single button for multiple purpose input.
// https://github.com/mathertel/OneButton
// -----

#ifndef OneButton_h
#define OneButton_h

class OneButton
{
public:
  // ----- Constructor -----
  OneButton(int pin, int active);

  // ----- Set runtime parameters -----

  // set # millisec after single click is assumed.
  void setClickTicks(int ticks);

  // set # millisec after press is assumed.
  void setPressTicks(int ticks);

  // attach functions that will be called when button was pressed in the specified way.
  void attachClick(callbackFunction newFunction);
  void attachDoubleClick(callbackFunction newFunction);
  void attachPress(callbackFunction newFunction); // DEPRECATED, replaced by longPressStart, longPressStop and duringLongPress
  void attachLongPressStart(callbackFunction newFunction);
  void attachLongPressStop(callbackFunction newFunction);
  void attachDuringLongPress(callbackFunction newFunction);

  // ----- State machine functions -----

  // call this function every some milliseconds for handling button events.
  void tick(void);
  bool isLongPressed();

private:
  int _pin;        // hardware pin number.
  int _clickTicks; // number of ticks that have to pass by before a click is detected
  int _pressTicks; // number of ticks that have to pass by before a long button press is detected
  const int _debounceTicks = 50; // number of ticks for debounce times.

  int _buttonReleased;
  int _buttonPressed;

  bool _isLongPressed;

  // These variables will hold functions acting as event source.
  callbackFunction _clickFunc;
  callbackFunction _doubleClickFunc;
  callbackFunction _pressFunc;
  callbackFunction _longPressStartFunc;
  callbackFunction _longPressStopFunc;
  callbackFunction _duringLongPressFunc;

  // These variables that hold information across the upcoming tick calls.
  // They are initialized once on program start and are updated every time the tick function is called.
  int _state;
  unsigned long _startTime; // will be set in state 1
};

#endif //OneButton_h


//----------------- LED Handling ------------------------
#define PIXEL_COUNT 5
#define PIXEL_TYPE WS2812B

/*-------------------------------------------------------------------------
  Spark Core library to control WS2811/WS2812 based RGB
  LED devices such as Adafruit NeoPixel strips.
  Currently handles 800 KHz and 400kHz bitstream on Spark Core,
  WS2812, WS2812B and WS2811.

  Also supports Radio Shack Tri-Color Strip with TM1803 controller
  400kHz bitstream.

  Written by Phil Burgess / Paint Your Dragon for Adafruit Industries.
  Modified to work with Spark Core by Technobly.
  Modified to work with Spark Button by jenesaisdiq.
  Contributions by PJRC and other members of the open source community.

  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing products
  from Adafruit!
  --------------------------------------------------------------------*/

/* ======================= Adafruit_NeoPixel.h ======================= */
/*--------------------------------------------------------------------
  This file is part of the Adafruit NeoPixel library.
  https://github.com/adafruit/Adafruit_NeoPixel

  NeoPixel is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as
  published by the Free Software Foundation, either version 3 of
  the License, or (at your option) any later version.

  NeoPixel is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with NeoPixel.  If not, see
  <http://www.gnu.org/licenses/>.
  --------------------------------------------------------------------*/

#ifndef SPARK_NEOPIXEL_H
#define SPARK_NEOPIXEL_H

// 'type' flags for LED pixels (third parameter to constructor):
#define WS2812   0x02 // 800 KHz datastream (NeoPixel)
#define WS2812B  0x02 // 800 KHz datastream (NeoPixel)
#define WS2811   0x00 // 400 KHz datastream (NeoPixel)
#define TM1803   0x03 // 400 KHz datastream (Radio Shack Tri-Color Strip)
#define TM1829   0x04 // 800 KHz datastream ()
#define WS2812B2 0x05 // 800 KHz datastream (NeoPixel)

class Adafruit_NeoPixel {

 public:

  // Constructor: number of LEDs, pin number, LED type
  Adafruit_NeoPixel(uint16_t n, uint8_t p=2, uint8_t t=WS2812B);
  ~Adafruit_NeoPixel();

  void
    begin(void),
    show(void) __attribute__((optimize("Ofast"))),
    setPin(uint8_t p),
    setPixelColor(uint16_t n, uint8_t r, uint8_t g, uint8_t b),
    setPixelColor(uint16_t n, uint32_t c),
    setBrightness(uint8_t),
    clear(void);
  uint8_t
   *getPixels() const,
    getBrightness(void) const;
  uint16_t
    numPixels(void) const;
  static uint32_t
    Color(uint8_t r, uint8_t g, uint8_t b);
  uint32_t
    getPixelColor(uint16_t n) const;

 private:

  const uint16_t
    numLEDs,       // Number of RGB LEDs in strip
    numBytes;      // Size of 'pixels' buffer below
  const uint8_t
    type;          // Pixel type flag (400 vs 800 KHz)
  uint8_t
    //pin,           // Output pin number
    brightness,
   *pixels;        // Holds LED color values (3 bytes each)
  uint32_t
    endTime;       // Latch timing reference
};

#endif // ADAFRUIT_NEOPIXEL_H
#endif // BlingButton_h
