#!/bin/bash

function run () {
  n=`pgrep -f $1`
 
  if [ "$n" != "" ]
  then
    kill -9 $n
  fi
}

run /tmp/test.py
