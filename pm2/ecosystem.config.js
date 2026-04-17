module.exports = {
  apps: [
    {
      name: 'tamil-calendar-api',
      script: './backend/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'backups'],
      max_restarts: 10,
      min_uptime: '10s',
      autorestart: true,
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/tamil-calendar.git',
      path: '/home/tamil-calendar',
      'post-deploy': 'npm install && npm run build',
      'pre-deploy-local': 'echo "Deploying to production..."',
    },
  },
};
