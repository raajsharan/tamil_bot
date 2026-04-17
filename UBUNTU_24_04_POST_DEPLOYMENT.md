# Ubuntu 24.04 Post-Installation Deployment Guide

**Status:** After system installation, deploy your application  
**Estimated Time:** 30 minutes  
**Prerequisites:** Completed system installation with `ubuntu-24-04-install.sh`

---

## 🎯 Overview

This guide walks you through deploying the Tamil Calendar application after the Ubuntu 24.04 system has been fully configured with all dependencies installed.

---

## 📋 Pre-Deployment Checklist

- [ ] System installation completed (`ubuntu-24-04-install.sh` ran successfully)
- [ ] Verification passed (`verify-installation.sh`)
- [ ] Application files ready (backend + frontend directories)
- [ ] PostgreSQL running and database created
- [ ] Nginx installed and running
- [ ] PM2 installed globally
- [ ] SSL certificates ready (or will use self-signed)

---

## 🚀 Deployment Steps

### Step 1: Switch to Application User

```bash
# Switch to tamil-calendar user
sudo su - tamil-calendar

# Verify you're in the right place
pwd  # Should show: /home/tamil-calendar

# List contents
ls -la
```

Expected output:
```
total 20
drwxr-xr-x  4 tamil-calendar tamil-calendar 4096 Apr 18 10:00 .
drwxr-xr-x 15 root           root           4096 Apr 18 10:00 ..
drwxr-xr-x  2 tamil-calendar tamil-calendar 4096 Apr 18 10:00 .pm2
drwxr-xr-x  3 tamil-calendar tamil-calendar 4096 Apr 18 10:00 app
drwxr-xr-x  3 tamil-calendar tamil-calendar 4096 Apr 18 10:00 frontend
```

---

### Step 2: Copy or Clone Application Files

**Option A: Copy from Local Machine**
```bash
# From your local machine, copy to server
scp -r /local/path/to/backend tamil-calendar@server-ip:/home/tamil-calendar/app/
scp -r /local/path/to/frontend tamil-calendar@server-ip:/home/tamil-calendar/app/

# Verify
ls -la /home/tamil-calendar/app/
```

**Option B: Clone from Git (if available)**
```bash
cd /home/tamil-calendar/app

git clone https://github.com/your-repo/tamil-calendar-backend backend
git clone https://github.com/your-repo/tamil-calendar-frontend frontend

# Or clone full repo
git clone https://github.com/your-repo/tamil-calendar .
```

---

### Step 3: Install Backend Dependencies

```bash
cd /home/tamil-calendar/app/backend

# Install production dependencies only
npm install --production

# Verify installation
npm list --depth=0
```

Expected major packages:
- express
- sequelize
- pg
- telegraf
- node-cron
- puppeteer

---

### Step 4: Configure Backend Environment

Create `.env` file with your settings:

```bash
nano .env
```

Paste this configuration:

```env
# ============================================================================
# ENVIRONMENT CONFIGURATION
# ============================================================================

# Node Environment
NODE_ENV=production

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tamil_calendar
DB_USER=postgres
DB_PASSWORD=Password@1234

# Connection pool
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_IDLE_TIMEOUT=30000
DB_CONNECT_TIMEOUT=5000

# ============================================================================
# SERVER CONFIGURATION
# ============================================================================
PORT=5000
NODE_WORKERS=4
API_TIMEOUT=30000

# ============================================================================
# JWT & SECURITY
# ============================================================================
JWT_SECRET=your-super-secret-key-that-is-32-characters-long
JWT_EXPIRY=7d
JWT_ALGORITHM=HS256

# ============================================================================
# TELEGRAM BOT CONFIGURATION
# ============================================================================
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_CHAT_ID=your-personal-chat-id
TELEGRAM_CHANNEL_ID=your-channel-id
TELEGRAM_CHANNEL_USERNAME=@your_channel_name

# ============================================================================
# WEB SCRAPER CONFIGURATION
# ============================================================================
DRIK_PANCHANG_URL=https://www.drikpanchang.com
PRO_KERALA_URL=https://prokerala.com
DINAMALAR_URL=https://www.dinamalar.com
SCRAPER_TIMEOUT=30000

# Scraper User Agents
SCRAPER_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36

# ============================================================================
# CRON JOB CONFIGURATION
# ============================================================================
# Format: "minute hour * * *" (cron format)
DAILY_UPDATE_SCHEDULE=30 4 * * *
TELEGRAM_POST_SCHEDULE=0 5 * * *
LOG_CLEANUP_SCHEDULE=0 6 * * 0

# Timezone for cron jobs (IANA format)
TIMEZONE=Asia/Kolkata

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================
LOG_LEVEL=info
LOG_DIR=/home/tamil-calendar/app/backend/logs
LOG_FILE_MAX_SIZE=10m
LOG_FILES_TO_KEEP=14

# ============================================================================
# BACKUP CONFIGURATION
# ============================================================================
BACKUP_ENABLED=true
BACKUP_DIR=/home/tamil-calendar/app/backend/backups
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_COMPRESS=true

# ============================================================================
# RATE LIMITING
# ============================================================================
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_WINDOW=900000
LOGIN_RATE_LIMIT_MAX=5

# ============================================================================
# CORS CONFIGURATION
# ============================================================================
CORS_ORIGINS=http://localhost:3000,http://localhost,https://your-domain.com
CORS_CREDENTIALS=true

# ============================================================================
# API DOCUMENTATION
# ============================================================================
API_DOCS_ENABLED=true
API_DOCS_PATH=/api/docs

# ============================================================================
# MONITORING & HEALTH
# ============================================================================
HEALTH_CHECK_ENABLED=true
HEALTH_CHECK_PATH=/health
METRICS_ENABLED=true
```

Save the file: Press `Ctrl+X`, then `Y`, then `Enter`

Verify the file was created:
```bash
cat .env
```

---

### Step 5: Create Logs and Backup Directories

```bash
# Create necessary directories
mkdir -p logs backups

# Verify
ls -la
```

---

### Step 6: Initialize Database

```bash
# Run database migrations (creates tables)
npm run migrate

# You should see output like:
# ✓ Database connection successful
# ✓ Calendar table created
# ✓ Admin table created
# ✓ Log table created
```

If you see errors:
```bash
# Check database connection directly
psql -U postgres -d tamil_calendar -h localhost -c "SELECT version();"

# Check .env file
cat .env
```

---

### Step 7: Create Admin User

```bash
# Run seed script (interactive)
npm run seed

# Follow the prompts:
# ? Admin Name: Your Name
# ? Admin Email: admin@tamil-calendar.local
# ? Admin Password: (enter secure password)
# ? Confirm Password: (re-enter password)
```

Expected output:
```
✓ Admin user created successfully
✓ Email: admin@tamil-calendar.local
✓ ID: 12345678-1234-1234-1234-123456789012

You can now login at: http://your-server/admin/login
```

**Save your admin credentials somewhere secure!**

---

### Step 8: Test Backend (Optional)

```bash
# Start backend in foreground (Ctrl+C to stop)
npm start

# In another terminal, test the API
curl http://localhost:5000/api/public/today
```

Expected: JSON response with today's Panchangam data

---

### Step 9: Build Frontend

```bash
cd /home/tamil-calendar/app/frontend

# Install production dependencies
npm install --production

# Build for production
npm run build

# Verify build
ls -la dist/
```

Expected: `dist/` folder with index.html and assets

---

### Step 10: Deploy Frontend to Nginx

```bash
# Copy built frontend to Nginx directory
sudo cp -r /home/tamil-calendar/app/frontend/dist/* /home/tamil-calendar/frontend/dist/

# Verify
ls -la /home/tamil-calendar/frontend/dist/

# Fix permissions
sudo chown -R www-data:www-data /home/tamil-calendar/frontend/dist/
```

---

### Step 11: Configure Nginx Site

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/tamil-calendar > /dev/null << 'NGINX_EOF'
# HTTP Server - Redirect to HTTPS
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Well-known for certbot
    location ~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server
upstream backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name _;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/tamil-calendar.local/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tamil-calendar.local/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 1000;

    # Client limits
    client_max_body_size 50M;

    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

    # Frontend - React App
    location / {
        root /home/tamil-calendar/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /home/tamil-calendar/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin login with strict rate limiting
    location /api/admin/login {
        limit_req zone=login_limit burst=3 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ ~$ {
        deny all;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Logging
    access_log /var/log/nginx/tamil-calendar-access.log combined;
    error_log /var/log/nginx/tamil-calendar-error.log;
}
NGINX_EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/tamil-calendar /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### Step 12: Setup SSL/TLS Certificates

**For local testing (self-signed):**
```bash
# Create directory
sudo mkdir -p /etc/letsencrypt/live/tamil-calendar.local

# Generate self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/letsencrypt/live/tamil-calendar.local/privkey.pem \
  -out /etc/letsencrypt/live/tamil-calendar.local/fullchain.pem \
  -subj "/C=IN/ST=Tamil Nadu/L=Chennai/O=Tamil Calendar/CN=tamil-calendar.local"

# Verify certificate
sudo openssl x509 -in /etc/letsencrypt/live/tamil-calendar.local/fullchain.pem -text -noout
```

**For production (Let's Encrypt):**
```bash
# Get a real certificate
sudo certbot certonly --nginx -d your-domain.com --agree-tos -m admin@example.com

# Auto-renewal will be enabled automatically
```

---

### Step 13: Create PM2 Configuration

```bash
cd /home/tamil-calendar/app

# Create ecosystem.config.js
cat > ecosystem.config.js << 'PM2_EOF'
module.exports = {
  apps: [
    {
      name: 'tamil-calendar-backend',
      script: './backend/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './backend/logs/pm2-error.log',
      out_file: './backend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Memory management
      max_memory_restart: '500M',
      
      // Graceful restart
      wait_ready: true,
      listen_timeout: 3000,
      kill_timeout: 5000,
      
      // Monitoring
      monitoring: true,
      
      // Restart strategy
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'backups', '.env'],
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
PM2_EOF

# Verify the file
cat ecosystem.config.js
```

---

### Step 14: Start Backend with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 for auto-start on system reboot
sudo pm2 startup systemd -u tamil-calendar --hp /home/tamil-calendar

# Verify it's running
pm2 status
pm2 logs tamil-calendar-backend
```

Expected output:
```
┌─ id──┬─ name ────────────────────┬─ mode ─┬─ status ─┬─ version ┐
│ id   │ tamil-calendar-backend    │ cluster│ online   │ 1.0.0    │
└─────┴────────────────────────────┴────────┴──────────┴──────────┘
```

---

### Step 15: Verify Everything is Running

```bash
# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql

# Test backend API
curl http://localhost:5000/api/public/today

# Test if port 5000 is listening
netstat -tlnp | grep 5000

# Test Nginx
curl -I http://localhost/
```

---

## ✅ Verification Checklist

- [ ] Backend dependencies installed
- [ ] `.env` file created with all settings
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Frontend built successfully
- [ ] Frontend deployed to Nginx
- [ ] Nginx configured and reloaded
- [ ] SSL certificates installed
- [ ] PM2 configuration created
- [ ] Backend started via PM2
- [ ] API responding on port 5000
- [ ] Frontend accessible on port 80/443
- [ ] PostgreSQL database populated

---

## 🌐 Access Your Application

Once everything is running:

```
Frontend:   http://your-server-ip
Admin:      http://your-server-ip/admin/login
API:        http://your-server-ip/api/
Health:     http://your-server-ip/health
```

Login credentials:
- Email: `admin@tamil-calendar.local` (or what you created)
- Password: (the password you set during `npm run seed`)

---

## 🔄 Useful Commands

```bash
# Backend management
pm2 restart tamil-calendar-backend      # Restart backend
pm2 stop tamil-calendar-backend         # Stop backend
pm2 start tamil-calendar-backend        # Start backend
pm2 logs tamil-calendar-backend         # View live logs
pm2 delete tamil-calendar-backend       # Remove from PM2
pm2 monit                               # Monitor resources

# Nginx management
sudo systemctl reload nginx             # Reload config
sudo systemctl restart nginx            # Restart Nginx
sudo nginx -t                           # Test config
sudo tail -f /var/log/nginx/tamil-calendar-error.log  # View errors

# Database management
psql -U postgres -d tamil_calendar      # Connect to database
npm run backup                          # Backup database
npm run restore                         # Restore database

# System management
df -h                                   # Disk usage
free -h                                 # Memory usage
top -u tamil-calendar                   # Process monitor
journalctl -u nginx -f                  # Nginx system logs
```

---

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs tamil-calendar-backend

# Test directly
cd /home/tamil-calendar/app/backend
node server.js
```

### Database connection error
```bash
# Test connection
psql -U postgres -d tamil_calendar -c "SELECT 1;"

# Check .env file
cat /home/tamil-calendar/app/backend/.env
```

### Nginx not serving frontend
```bash
# Check config
sudo nginx -t

# Check file permissions
ls -la /home/tamil-calendar/frontend/dist/

# Check error log
sudo tail -f /var/log/nginx/tamil-calendar-error.log
```

### Port already in use
```bash
# Find what's using port 5000
sudo lsof -i :5000

# Find what's using port 80
sudo lsof -i :80
```

---

## 📊 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Memory monitoring
watch -n 1 'ps aux | grep node'

# Nginx traffic
tail -f /var/log/nginx/tamil-calendar-access.log
```

---

## 🔒 Security After Deployment

1. **Change JWT Secret** - Update in `.env`
2. **Configure Firewall** - Already done, verify with `sudo ufw status`
3. **Setup Backups** - Automated backup runs daily
4. **Monitor Logs** - Check regularly for errors
5. **Keep Updated** - Run `sudo apt update && apt upgrade -y`

---

## 📞 Next Steps

- [ ] Configure Telegram bot (update `.env` with token)
- [ ] Setup domain with SSL
- [ ] Configure automated backups
- [ ] Setup monitoring/alerting
- [ ] Test all features
- [ ] Create backup user for admin

---

**Status:** ✅ Deployment Complete  
**Last Updated:** April 18, 2026  
**Application Ready:** Yes

வாழ்க தமிழ்! 🇹🇦
