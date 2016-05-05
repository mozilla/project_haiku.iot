#include "BlingButton.h"

// IMPORTANT: Set pixel COUNT, PIN and TYPE
#define PIXEL_COUNT 5

BlingButton b = BlingButton();

bool buttonState = false;

// We start with the setup function.
void setup() {
  Serial.begin(9600);
  b.begin();
  b.log("setup");
}


void do_signal1() {
  b.rainbow(2);
  delay(500);
  b.allLedsOn(0, 0, 0);
}

void loop() {
  // Get current button state.
  bool newState = b.buttonOn();

  // Check if state changed from not-pressed to pressed
  if (newState && !buttonState) {
    // Short delay to debounce button.
    delay(20);
    // Check if button is still low after debounce.
    newState = b.buttonOn();
    String msg;
    if (newState) {
      b.log("button is pressed");
      b.vibrate(100);
      do_signal1();
      b.log("signalled");
    } else {
      msg = "button not pressed";
    }
  }

  // Set the last button state to the old state.
  buttonState = newState;
}

