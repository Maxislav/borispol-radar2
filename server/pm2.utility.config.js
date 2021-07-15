const pm2Config = {
    apps: [
        {
            name: 'borispol',
            script: './server/borispol-radar.js --rootdir ../dist --port 80',
            exec_mode: 'cluster_mode',
            instances: 1,
        },
    ],
};

module.exports = pm2Config;
