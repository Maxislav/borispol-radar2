#!/usr/bin/env bash
cd /home/max/www/borispol-radar2
./node_modules/.bin/ts-node -- ./server/save-image.cron.ts --rootdir ../
