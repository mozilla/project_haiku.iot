#!/bin/bash

# Usage
# find /path/to/PDF/directory -type f -name "*.pdf" -print0 | xargs -0 ./convert-to-json.sh
#
DIR=`dirname $0`
for PDF in "$@"
do
  outfile=`echo $PDF | sed 's/\(.*\.\)pdf/\1json/'`
  python $DIR/scraperJSON.py "$PDF"
done