#pragma SPARK_NO_PREPROCESSOR
#include "BlingButton.h"
#include "ButtonConfig.h"
#include "softap_http.h"
#include "Page.h"

/* -----------------------------------------

The following sketch will be flashed on paired devices
with respective config settings

Press of button on one device will turn on LEDs on the paired device
------------------------------------------*/
BlingButton b = BlingButton();

void confirmHandShake(const char *event, const char *data){
  //Publish an event to confirm handshake for logs
  char str[80];
  strcpy (str, "Received ");
  strcat (str, event);
  strcat (str," data ");
  strcat (str, data);
  if (VERBOSE_MODE) {
    Serial.print(str);
  }
  Particle.publish(PUBLISH_CONFIRM_EVENT, String(str), 60, PRIVATE);
  delay(1000);
};

void handleEvent(const char *event, const char *data)
{
  // Compare the data returned with event and handle accordingly
  // This could be used to pass click, hold, or double click states
  if (strcmp(data,"click")==0) {
    //Turn on all LEDs with blue color
    b.allLedsOn(0,0,255);
    delay(1000);
  } else if (strcmp(data,"doubleclick")==0) {
    //Turn on all LEDs with yellow color
    b.allLedsOn(0,255,0);
    delay(1000);
  } else if (strcmp(data,"longpress")==0) {
    //Turn on all LEDs with red color
    b.allLedsOn(255,0,0);
    delay(1000);
  }
  // Confirm handshake by publishing successfuly received event
  confirmHandShake(event, data);
  // Turn off all LEDs
  b.allLedsOff();
  delay(100);
};


// This function will be called when the button1 was pressed 1 time
void click() {
  Serial.println("Button click.");
  b.ledOn(12, 0, 0, 255); // blue
  delay(500);
  b.ledOff(12);
  // Publish the event PUBLISH_EVENT_NAME for paired device to use
  // with data stored in buffer array
  char buffer[60] = "click";
  Particle.publish(PUBLISH_EVENT_NAME,String(buffer), 60, PRIVATE);
  delay(500);
} // click1


// This function will be called when the button was pressed 2 time
void doubleClick() {
  Serial.println("Button double click.");
  b.ledOn(12, 0, 255, 0); // green
  delay(500);
  b.ledOff(12);
  // Publish the event PUBLISH_EVENT_NAME for paired device to use
  // with data stored in buffer array
  char buffer[60] = "doubleclick";
  Particle.publish(PUBLISH_EVENT_NAME,String(buffer), 60, PRIVATE);
  delay(500);
} // click1


// This function will be called once, when the button is released
// after beeing pressed for a long time.
void longPress() {
  Serial.println("Button longPress");
  b.ledOn(12, 255, 0, 0); // red
  delay(500);
  b.ledOff(12);
  // Publish the event PUBLISH_EVENT_NAME for paired device to use
  // with data stored in buffer array
  char buffer[60] = "longpress";
  Particle.publish(PUBLISH_EVENT_NAME,String(buffer), 60, PRIVATE);
  delay(500);
} // longPress


// We start with the setup function.
void setup() {
  Serial.begin(9600);
  b.begin();
  b.attachClick(click);
  b.attachDoubleClick(doubleClick);
  b.attachLongPress(longPress);

  // Subscribe to paired device event event using Particle.subscribe
  // Subscribe will listen for the event SUBSCRIBE_EVENT_NAME and
  // when it finds it, will run the function handleEvent()
  Particle.subscribe(SUBSCRIBE_EVENT_NAME, handleEvent, MY_DEVICES);
};

void loop() {
  b.listen();
};

STARTUP(softap_set_application_page_handler(MyPage::display, nullptr));