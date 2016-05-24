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
#define BATTERY_CHECK_TIME 1800000 // Check after every 1800 seconds or 30 mins
#define BATTERY_THRESHOLD 3 // Battery threshold below which device should sleep
#define BATTERY_CHECK 1
#define BATTERY_LEVEL_EVENT "BATTERY_LEVEL"
