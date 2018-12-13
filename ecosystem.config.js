module.exports = {
  apps : [{
    name   : "meat-api",
    script : "./dist/main.js",
    instances: 2,
    exec_mode: "cluster",
    env: {
      SERVER_PORT: 5000,
      DB_URL: 'mongodb://meat-api:meat-api1@ds047146.mlab.com:47146/meat-api',
      NODE_ENV: "development"
    },
    env_production: {
      SERVER_PORT: 5001,
      NODE_ENV: "production"
    }
  }]
}
