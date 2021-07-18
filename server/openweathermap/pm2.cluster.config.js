const pm2Config = {
    apps: [
        {
            name: 'openrain',
            script: 'index.js',
            exec_mode: 'cluster_mode',
            instances: 1,
        },
    ],
};

module.exports = pm2Config;
