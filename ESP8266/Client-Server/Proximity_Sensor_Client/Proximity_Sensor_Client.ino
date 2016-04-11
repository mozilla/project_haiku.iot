// Include the ESP8266 WiFi library. (Works a lot like the
// Arduino WiFi library.)
#include <ESP8266WiFi.h>
#include <Adafruit_VCNL4010.h>
#include <Wire.h>

//////////////////////
// WiFi Definitions //
//////////////////////
const char *WiFiSSID = "ESP8266";
const char *WiFiPSK = "sparkfun";

/////////////////////
// Pin Definitions //
/////////////////////
const int LED_PIN = 5; // Thing's onboard, green LED

bool SERVER_LED_TURN_ON = 0;

#define PROXIMITY_THRESHOLD  3000   // The threshold value to consider an object near
                                     // and handle event.

IPAddress host(192,168,4,1);

// Create VCNL sensor object
Adafruit_VCNL4010 vcnl = Adafruit_VCNL4010();

void setup() 
{
  initHardware();
  connectWiFi();
  digitalWrite(LED_PIN, HIGH);
}

void loop() 
{
  handleProximitySensor(); 
}

void handleProximitySensor() {
  // Grab VCNL proximity measurement.
  uint16_t proximity = vcnl.readProximity();
  Serial.print("\t\tProximity = ");
  Serial.println(proximity);
  // Turn on LED light on server ESP if an object is near (proximity measurement is larger than threshold).
  if ((proximity > PROXIMITY_THRESHOLD) && (SERVER_LED_TURN_ON == 0)) {
    // Turn on the LED on server ESP.
    postToServer("0");
    SERVER_LED_TURN_ON = 1;
    // Pause a bit.
    delay(1000);
  } else if (proximity > PROXIMITY_THRESHOLD) {
    delay(1000);
    return; // do nothing
  } else if (SERVER_LED_TURN_ON == 1){
    // Turn off the LED on server ESP.
    postToServer("1");
    SERVER_LED_TURN_ON = 0;
     // Pause a bit.
    delay(1000);
  }
}

void postToServer(String state) {
  // Now connect to server, and post our data:
  WiFiClient client;
  const int httpPort = 80;
  
  if (!client.connect(host, httpPort)) 
  {
    // If we fail to connect, return.
    Serial.println("connection failed");
    return;
  }
  
  client.print(String("GET /led/" + state + " HTTP/1.1\r\n") +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
  delay(10); 
    
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
}

void connectWiFi()
{
  byte ledStatus = LOW;
   
  // Set WiFi mode to station (as opposed to AP or AP_STA)
  WiFi.mode(WIFI_STA);
  // WiFI.begin([ssid], [passkey]) initiates a WiFI connection
  // to the stated [ssid], using the [passkey] as a WPA, WPA2,
  // or WEP passphrase.
  
  WiFi.begin(WiFiSSID, WiFiPSK);
  
  // Use the WiFi.status() function to check if the ESP8266
  // is connected to a WiFi network.  
  while (WiFi.status() != WL_CONNECTED)
  {
    // Blink the LED
    digitalWrite(LED_PIN, ledStatus); // Write LED high/low
    ledStatus = (ledStatus == HIGH) ? LOW : HIGH;
    
    // Delays allow the ESP8266 to perform critical tasks
    // defined outside of the sketch. These tasks include
    // setting up, and maintaining, a WiFi connection.
    delay(100);
    // Potentially infinite loops are generally dangerous.
    // Add delays -- allowing the processor to perform other
    // tasks -- wherever possible.
    Serial.println(WiFi.status());
  }
}

void initHardware()
{
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

   // Initialize VCNL sensor library.
  if (vcnl.begin()) {
    Serial.println("Found VNCL sensor");
  }
  else {
    Serial.println("No VNCL found ... check your connections");
    while (1);
  }

}

