// Basic bluetooth test sketch. HC-05_01_9600
// HC-05 GW-040 
// 
// 
//  Uses hardware serial to talk to the host computer and software serial for communication with the bluetooth module
//
//  Pins
//  BT VCC to Arduino 5V out. 
//  BT GND to GND
//  BT RX to Arduino pin 3 (through a voltage divider)
//  BT TX to Arduino pin 2 (no need voltage divider)
//
//  When a command is entered in the serial monitor on the computer 
//  the Arduino will relay it to the bluetooth module and display the result.
//
 
#include <SoftwareSerial.h>
SoftwareSerial BTSerial(2, 3); // RX | TX
 
void setup() 
{
    Serial.begin(9600);
    Serial.println("Arduino with HC-05 is ready");
 
    // HC-05 default baud rate is 38400
    BTSerial.begin(38400);  
    Serial.println("BTserial started at 38400");
}
 
void loop()
{
 
  // Keep reading from slave HC-05 and send to Arduino Serial Monitor
  if (BTSerial.available())
    Serial.write(BTSerial.read());
 
  // Keep reading from Arduino Serial Monitor and send to slave HC-05
  if (Serial.available())
  BTSerial.write(Serial.read());
}
