#include "InternetButton.h"
#include "ButtonConfig.h"
// -----------------------------------------
// Publish and Subscribe with Internet Button
/* -----------------------------------------

The following sketch will be flashed on paired devices
with respective config settings

Press of button on one device will turn on LEDs on the paired device
------------------------------------------*/

InternetButton b = InternetButton();

// We start with the setup function.
void setup() {
  Serial.begin(9600);
  b.begin();

  // Subscribe to paired device event event using Particle.subscribe
  // Subscribe will listen for the event SUBSCRIBE_EVENT_NAME and
  // when it finds it, will run the function handleEvent()
  Particle.subscribe(SUBSCRIBE_EVENT_NAME, handleEvent, MY_DEVICES);
}


void loop() {
  // Process individual buttons and LED response
  if (b.buttonOn(1)) {
    b.ledOn(12, 255, 0, 0); // Red
    // Publish the event PUBLISH_EVENT_NAME for paired device to use
    // with data stored in buffer array
    char buffer[60] = "click";
    Particle.publish(PUBLISH_EVENT_NAME,String(buffer), 100, PRIVATE);
    delay(500);
  }
  else {
    b.ledOn(12, 0, 0, 0);
  }
}

void handleEvent(const char *event, const char *data)
{
  if (VERBOSE_MODE) {
    Serial.print(event);
    Serial.print(", data: ");
    Serial.print(data);
  }

  // Compare the data returned with event and handle accordingly
  // This could be used to pass click, hold, or double click states
  if (strcmp(data,"click")==0) {
    //Turn on all LEDs with blue color
    b.allLedsOn(0,20,20);
    delay(2000);
    // Turn off all LEDs
    b.allLedsOff();
    delay(1000);
  }
}
