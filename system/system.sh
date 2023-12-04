#!/bin/sh

RUNTIME=$(cat /proc/uptime | awk '{ print $1 }')
# __LOAD=$(uptime)
# _LOAD="${__LOAD#*average: }"
# LOAD="${_LOAD%%,*}"
_TEMP=$(vcgencmd measure_temp)
TEMP="${_TEMP#*temp=}"
MEM_TOTAL=$(free | grep Mem: | awk '{ print $2 }')
MEM_AVAIL=$(free | grep Mem: | awk '{ print $7 }')
OS_VERSION=$(cat /home/pi/.OS_VERSION)
RPI_SERIAL=$(grep "Serial" /proc/cpuinfo | awk '{print $3}')
ETH1=$(ifconfig eth1 2>/dev/null| grep "inet " | awk '{ print $2 }')
WLAN0=$(ifconfig wlan0 | grep "inet " | awk '{ print $2 }')
SSID0=$(iw wlan0 info | grep "ssid " | awk '{ print $2 }')
echo $RPI_SERIAL,$OS_VERSION,$RUNTIME,$TEMP,$MEM_TOTAL,$MEM_AVAIL,$WLAN0,$SSID0,$ETH1