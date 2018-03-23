#!/usr/bin/env bash
cd /var/www/
./node_modules/.bin/ts-node -- ./borispol-radar-server/save-image.cron.ts --rootdir ../dist
