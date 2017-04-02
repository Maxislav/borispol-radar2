## Borispol radar2 (Vue.js, Webpack2)

![](https://github.com/Maxislav/borispol-radar2/blob/master/readme.png?raw=true?raw=true=400x200)

***
## Setup

### Copy
Download files from ~/dist/* to you work dir

### Cron task
edit cron.sh
```
#!/usr/bin/env bash
cd ~/www/borispol.radar/php
php saveimgs.php
```

~$ crontab -e 
add line 
```
0 * * * * sh ~www/borispol.radar/cron.sh
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

