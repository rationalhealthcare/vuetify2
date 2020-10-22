#!/bin/bash


# env | grep -ir VUE_APP_
sed -i 's/old-text/new-text/g' input.txt
nginx -g daemon off