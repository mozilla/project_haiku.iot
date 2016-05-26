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
unsigned long prev_time = millis();

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
   // Vibrate
   b.vibrate(200);
  // Compare the data returned with event and handle accordingly
  // This could be used to pass click, hold, or double click states
  if (strcmp(data,"click")==0) {
    //Turn on all LEDs with rainbow colors
    b.rainbow(2);
  } else if (strcmp(data,"doubleclick")==0) {
    //Turn on alternate LEDs with yellow and green color
    b.dualColor(255, 255, 0, 0, 255, 0, 50);
  } else if (strcmp(data,"longpress")==0) {
    //Turn on alternate LEDs with blue color
    b.dualColor(0, 0, 255, 0, 0, 0, 50);
  }
  delay(500);
  // Confirm handshake by publishing successfuly received event
  confirmHandShake(event, data);
  delay(500);
  // Turn off all LEDs
  b.allLedsOff();
  delay(100);
};


// This function will be called when the button1 was pressed 1 time
void click() {
  Serial.println("Button click.");
  b.ledOn(12, 230, 0, 255); // violet dominant rainbow color
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
  b.ledOn(12, 255, 255, 0); // yellow
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
  b.ledOn(12, 0, 0, 255); // blue
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
  #if defined(BATTERY_CHECK)
    if(millis() - prev_time >= BATTERY_CHECK_TIME) {
      Serial.println("Battery Check Triggered");
      // Log the Battery level
      float batteryLevel = b.batteryLevel();
      char batteryBuffer[60];
      sprintf(batteryBuffer, "%5.2f", batteryLevel);
      Particle.publish(BATTERY_LEVEL_EVENT,String(batteryBuffer), 60, PRIVATE);
      // Put device in sleep mode when battery level
      // is below BATTERY_THRESHOLD
      if (batteryLevel < BATTERY_THRESHOLD) {
        System.sleep(SLEEP_MODE_DEEP);
      }
      prev_time = millis();
    }
  #endif
};

STARTUP(softap_set_application_page_handler(MyPage::display, nullptr));
