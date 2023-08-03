const pm2Config = {
    apps: [
        {
            name: 'borispol',
            script: './server/borispol-radar.js',
            env_production: {
                NODE_ENV: "prod"
            },
            env_development: {
                NODE_ENV: "dev"
            }
        },
        {
            name: 'openrain',
            script: './server/openweathermap/index.js',
            exec_mode: 'cluster_mode',
            max_memory_restart: '200M',
            instances: 1,
        },
    ],
};

module.exports = pm2Config;
