#!/bin/bash

# Production Startup Script

echo "Starting Tamil Calendar Application..."

# Navigate to project directory
cd /home/tamil-calendar

# Start with PM2
pm2 start pm2/ecosystem.config.js --env production

# Show status
pm2 status

echo ""
echo "Application started successfully!"
echo "View logs: pm2 logs"
echo "Monitor: pm2 monit"
