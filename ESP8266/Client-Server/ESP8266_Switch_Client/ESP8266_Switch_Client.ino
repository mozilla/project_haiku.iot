// Include the ESP8266 WiFi library. (Works a lot like the
// Arduino WiFi library.)
#include <ESP8266WiFi.h>

//////////////////////
// WiFi Definitions //
//////////////////////
const char *WiFiSSID = "ESP8266";
const char *WiFiPSK = "sparkfun";

/////////////////////
// Pin Definitions //
/////////////////////
const int LED_PIN = 5; // Thing's onboard, green LED
const int button1Pin = 4;  // pushbutton 1 pin
const int button2Pin = 0;  // pushbutton 1 pin

IPAddress host(192,168,4,1);

void setup() 
{
  initHardware();
  connectWiFi();
  digitalWrite(LED_PIN, HIGH);
}

void loop() 
{
  handleButtonPress();
}

void handleButtonPress() {
  int button1State = 1, button2State = 1;
  
  button1State = digitalRead(button1Pin); // read input value
  button2State = digitalRead(button2Pin);

  if (button1State == LOW) // if we're pushing button 1    
  {
    Serial.println("LED ON");
    postToServer("0");
  }
  else if (button2State == LOW) // if we're pushing button 2   
  {
    Serial.println("LED OFF");
    postToServer("1");
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

  // Set up the pushbutton pins to be an input:
  pinMode(button1Pin, INPUT);
  pinMode(button2Pin, INPUT);

}

