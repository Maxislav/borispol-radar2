#!/usr/bin/env bash
cd /home/maxislav/www/borispol-radar2
/usr/local/bin/node ./node_modules/.bin/ts-node -- ./server/save-image.cron.ts --rootdir ../src
