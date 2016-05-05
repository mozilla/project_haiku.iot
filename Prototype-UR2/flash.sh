#!/bin/bash

HELP=0
DRY_RUN=0

while getopts ":n:h" opt; do
  case $opt in
    h)
      echo "got -h, setting HELP true"
      HELP=1; shift 1
      ;;
    n)
      echo "got -n, setting DRY_RUN true"
      DRY_RUN=1; shift 1
      ;;
  esac
done

DIR=$1
DEVICENAME=$2

usage() {
  echo "#---------------------------------"
  echo "# Usage: $0 -n DIR/PATH DEVICENAME"
  echo "# Params:"
  echo "#   DEVICENAME e.g. Button-RC23, it can be found on your Particle dashboard"
  echo "#              at https://dashboard.particle.io/user/devices"
  echo "#   DIR/PATH should be the path to the directory containing the "
  echo "#            .ino, .h and .cpp files which you wish to flash to the device"
  echo "# Flags: "
  echo "#   -h for this message"
  echo "#   -n for a dry-run"
  echo "#---------------------------------"
}
flash() {
  cd $DIR
  files=`find . -type f \( -name "*ino" -o -name "*h" -o -name "*cpp" \)`
  if [ $DRY_RUN -ne 0 ];
  then
    echo particle flash $DEVICENAME $files
  else
    particle flash $DEVICENAME $files
  fi
}

if [ $HELP -ne 0 ];
then
  usage
elif [ -z $DEVICENAME ];
then
   usage
else
  flash
fi