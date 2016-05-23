// EVENT NAME SETTINGS
// ----------------------------------------------------------------------------------------------
// These settings are used in both pair of buttons
// ----------------------------------------------------------------------------------------------

// Comment before flashing Device_2
// For DEVICE_1
#define PUBLISH_EVENT_NAME "DEVICE_1_BUTTON_PRESS"
#define SUBSCRIBE_EVENT_NAME  "DEVICE_2_BUTTON_PRESS"


// Uncomment before flashing Device_2
// For DEVICE_2
//#define PUBLISH_EVENT_NAME "DEVICE_2_BUTTON_PRESS"
//#define SUBSCRIBE_EVENT_NAME  "DEVICE_1_BUTTON_PRESS"

// Event to confirm handshake
#define PUBLISH_CONFIRM_EVENT "RECEIVED_CONFIRMATION"

#define VERBOSE_MODE  true  // If set to 'true' enables debug output
#define BATTERY_CHECK false
#define BATTERY_CHECK_TIME 60000 // Check after every 60 seconds if BATTERY_CHECK is true
#define BATTERY_THRESHOLD 1 // Battery threshold below which device should sleep
