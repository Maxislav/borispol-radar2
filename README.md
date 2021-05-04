## Borispol radar2 (Vue.js, Webpack2)

![](https://github.com/Maxislav/borispol-radar2/blob/master/readme.png?raw=true?raw=true=400x200)

***
## Setup

### Required: Node;
***

### Copy
Download files from ~/dist/* to you work dir


## Develop

### Install

```
~$ npm i -g webpack
~$ npm i
```
### Build Prod
```
~$ webpack --mode production
```

### Run Debug   //localhost:8080

```
~$ webpack-dev-server --open
~$ node server/borispol-radar.ts --rootdir ../dist  --port 8090
```
#### Run dev npm command
```
~$ npm run tsc-be:w
~$ npm run build-dev-ui
~$ npm run server-static-dev
```




### Run you site on port 80
```shell script
node ./server/borispol-radar.js --rootdir ../dist --port 80


```

### prod pm2
```shell script
pm2 start 'node /var/www/borispol-radar2/server/borispol-radar.js --rootdir ../dist' --name borispol  --max-memory-restart 5000M
```
