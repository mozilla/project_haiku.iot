# Shell script to log data in respective log files

#!/bin/bash
curl "https://api.particle.io/v1/devices/events?access_token=b6142284818f066f46d08b7273025fb9646b6a1d" > 1.log &
curl "https://api.particle.io/v1/devices/events?access_token=30927092dd037d32bb89b2926c07c7aca6884bbb" > 2.log &
