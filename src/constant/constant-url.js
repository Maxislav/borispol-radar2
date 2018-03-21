const url = {
    prod:  'http://178.62.44.54:8085',
    dev: `${window.location.protocol}//${window.location.hostname}:${8085}`
};
export const socketUrl = NODE_ENV == 'dev' ? url.dev : url.prod
