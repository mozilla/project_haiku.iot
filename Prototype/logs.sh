# Shell script to log data in respective log files

#!/bin/bash
curl "https://api.particle.io/v1/devices/events?access_token=<token>" > 1.log &
curl "https://api.particle.io/v1/devices/events?access_token=<token>" > 2.log &
