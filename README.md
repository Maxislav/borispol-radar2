## Borispol radar2 (Vue.js, Webpack2)

![](https://github.com/Maxislav/borispol-radar2/blob/master/readme.png?raw=true?raw=true=400x200)

***
## Setup

### Required: Node;
***

### Copy
Download files from ~/dist/* to you work dir

### Cron task
edit server/cron.sh
```
#!/usr/bin/env bash
cd ~/www/borispol-radar2
./node_modules/.bin/ts-node -- ./server/save-image.cron.ts --rootdir ../
```

 
~$ crontab -e 
add line 
```
1 * * * * sh ~www/borispol.radar/server/cron.sh
```
***

## Develop

### Install

```
~$ npm i -g webpack
~$ npm i
```
### Build Prod
```
~$ webpack
```

### Debug   //localhost:8080

```
~$ npm i webpack-dev-server -g
~$ npm i
~$ npm start

```

### Run you site on port 8080
```
//
npm run server-static-ts

```


### Run you site on port 80
```
./node_modules/.bin/ts-node  --project ./server/tsconfig.json ./server/save-image.cron.ts --rootdir ../dist

 ts-node --project ./server/tsconfig.json ./server/borispol-radar.ts --rootdir ../dist --port 80

```
