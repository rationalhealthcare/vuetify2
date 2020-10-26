#!/bin/sh
CONFIG_JS_PATH="/usr/share/nginx/html/config.js"
echo "var config = new Map();" > $CONFIG_JS_PATH
for value in $(env | grep -ir VUE_APP_)
do
  echo "localStorage.setItem("\"$(echo $value | cut -d '=' -f 1)\"", \"$(echo $value | cut -d '=' -f 2-)\");" >> $CONFIG_JS_PATH
done
exit 0