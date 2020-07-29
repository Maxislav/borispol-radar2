const url = {
    prod:  'http://178.62.44.54:8084',
    dev: `${window.location.protocol}//${window.location.hostname}:${8084}`
};
console.log(NODE_ENV);
export const socketUrl = NODE_ENV == 'dev' ? url.dev : url.prod
