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
    ],
};

module.exports = pm2Config;
