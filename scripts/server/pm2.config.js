const path = require('path')

module.exports = {
  apps: [
    {
      name: 'ssr',
      script: path.resolve(__dirname, './index.js'),
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
