#!/bin/sh -e
#
# openpibo-tools-start
#
sudo gpio mode 7 out
sudo gpio write 7 1
sudo omxplayer -o local --vol -1500 /home/pi/openpibo-files/audio/opening.mp3 &
sudo python3 /home/pi/openpibo-tools/system/booting.py
cd /home/pi/openpibo-tools/development-tool;sudo node main.js &
cd /home/pi/openpibo-tools/project;sudo python3 main.py &
exit 0
