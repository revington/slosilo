#!/bin/bash
export DEBUG='*'
echo "^c twice to kill, once to respawn"
while : 
do
	node server.js
	echo "slosilo crashed! wait 1 to respawn. ^c to kill"
	sleep 1
done
