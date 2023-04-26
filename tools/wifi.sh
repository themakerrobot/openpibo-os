#!/bin/bash
RES=`sudo iwlist wlan0 scan | grep "Quality\|ESSID" | awk -F'[ :=]+' '/Quality/{quality = $3} /ESSID/{print $3","quality}' | sort -t "," -r -k 2 | uniq`
echo $RES
