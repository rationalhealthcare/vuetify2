#!/bin/bash

echo "" > /usr/share/nginx/html/static/config.js

for value in $(env | grep -ir VUE_APP_)
do
    echo "process.env["\"$(echo $value | cut -d '=' -f 1)\""] = \"$(echo $value | cut -d '=' -f 2-)\";" >> /usr/share/nginx/html/static/config.js
done