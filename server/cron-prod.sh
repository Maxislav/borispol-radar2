#!/usr/bin/env bash
cd /var/www/borispol-radar/
./node_modules/.bin/ts-node --project server/tsconfig.json ./server/save-image.cron.ts --rootdir ../dist
