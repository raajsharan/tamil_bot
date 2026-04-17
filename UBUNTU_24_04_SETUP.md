# 🐧 Ubuntu 24.04 LTS Direct Installation Guide

**Target System:** Ubuntu 24.04 LTS (Noble Numbat)  
**Database:** PostgreSQL 16  
**Web Server:** Nginx  
**Runtime:** Node.js 18+ LTS  
**Status:** ✅ Production Ready  

---

## 📋 Pre-Installation Checklist

- [ ] Ubuntu 24.04 LTS fresh install
- [ ] SSH access to server
- [ ] sudo privileges
- [ ] Static IP address assigned
- [ ] Domain name (for SSL)
- [ ] Telegram bot token (for bot features)

---

## 🚀 Step 1: System Preparation

### 1.1 Update System
```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

### 1.2 Install Essential Tools
```bash
sudo apt install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    python3-pip \
    htop \
    nano \
    vim \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release
```

### 1.3 Configure Firewall (UFW)
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (optional, only if remote access needed)
# sudo ufw allow 5432/tcp

# Verify firewall
sudo ufw status
```

---

## 🗄️ Step 2: PostgreSQL 16 Installation

### 2.1 Add PostgreSQL Repository
```bash
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo apt update
```

### 2.2 Install PostgreSQL 16
```bash
sudo apt install -y postgresql-16 postgresql-contrib-16

# Verify installation
psql --version
sudo systemctl status postgresql
```

### 2.3 Create Database & User

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside psql prompt, run:
CREATE DATABASE tamil_calendar;
CREATE USER postgres WITH PASSWORD 'Password@1234';
ALTER USER postgres WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE tamil_calendar TO postgres;
\c tamil_calendar
GRANT ALL ON SCHEMA public TO postgres;
\q
```

### 2.4 Test Database Connection
```bash
psql -U postgres -d tamil_calendar -h localhost -c "SELECT version();"
```

Expected output: PostgreSQL version 16.x

### 2.5 Configure PostgreSQL
Edit `/etc/postgresql/16/main/postgresql.conf`:
```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Find and modify:
```
listen_addresses = 'localhost'
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 2.6 Enable PostgreSQL Auto-Start
```bash
sudo systemctl enable postgresql
```

---

## 🟢 Step 3: Node.js Installation

### 3.1 Install Node.js 18 LTS (NodeSource)
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

Expected: v18.x.x and npm 9.x.x or higher

### 3.2 Install Node Version Manager (Optional)
```bash
# Install NVM for managing Node versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

source ~/.bashrc

# List available versions
nvm list-remote

# Install and use Node 18
nvm install 18
nvm use 18
```

---

## 🌐 Step 4: Nginx Installation

### 4.1 Install Nginx
```bash
sudo apt install -y nginx

# Verify installation
nginx -v

# Check status
sudo systemctl status nginx
```

### 4.2 Enable Nginx Auto-Start
```bash
sudo systemctl enable nginx
```

### 4.3 Create Nginx Configuration for Tamil Calendar

```bash
sudo nano /etc/nginx/sites-available/tamil-calendar
```

Paste the following configuration:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name _;

    location ~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
upstream backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tamil-calendar.local;

    # SSL certificates (configure after certbot setup)
    ssl_certificate /etc/letsencrypt/live/tamil-calendar.local/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tamil-calendar.local/privkey.pem;
    
    # SSL Configuration
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

    # Client size limits
    client_max_body_size 50M;

    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

    # Frontend - React app
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
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin login - stricter rate limiting
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
```

### 4.4 Enable Nginx Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/tamil-calendar /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔐 Step 5: SSL/TLS with Certbot

### 5.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Generate SSL Certificate
```bash
# For local testing (self-signed)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/letsencrypt/live/tamil-calendar.local/privkey.pem \
  -out /etc/letsencrypt/live/tamil-calendar.local/fullchain.pem \
  -subj "/C=IN/ST=Tamil Nadu/L=Chennai/O=Tamil Calendar/CN=tamil-calendar.local"

# For production (Let's Encrypt)
sudo certbot certonly --nginx -d tamil-calendar.local --agree-tos -m admin@tamil-calendar.local
```

### 5.3 Auto-Renewal (Let's Encrypt)
```bash
# Enable certbot auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## 👤 Step 6: Create Application User

### 6.1 Create Non-Root User
```bash
# Create user
sudo useradd -m -s /bin/bash tamil-calendar

# Set password (optional)
sudo passwd tamil-calendar

# Add sudo privileges
sudo usermod -aG sudo tamil-calendar

# Create application directory
sudo mkdir -p /home/tamil-calendar/app
sudo chown -R tamil-calendar:tamil-calendar /home/tamil-calendar

# Switch to new user
sudo su - tamil-calendar
```

---

## 📦 Step 7: Deploy Application

### 7.1 Clone/Copy Application
```bash
# As tamil-calendar user
cd /home/tamil-calendar/app

# Copy backend files
cp -r /path/to/backend .
cp -r /path/to/frontend .

# Or clone from git
# git clone https://your-repo/tamil-calendar-app.git
```

### 7.2 Install Backend Dependencies
```bash
cd /home/tamil-calendar/app/backend

npm install --production

# Create .env file
nano .env
```

Add the following to `.env`:
```env
# Node Environment
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tamil_calendar
DB_USER=postgres
DB_PASSWORD=Password@1234

# Server
PORT=5000
NODE_WORKERS=4

# JWT
JWT_SECRET=your-secret-key-change-this-32chars
JWT_EXPIRY=7d

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token-here
TELEGRAM_CHAT_ID=your-chat-id-here
TELEGRAM_CHANNEL_ID=your-channel-id-here

# Scrapers
DRIK_PANCHANG_URL=https://www.drikpanchang.com
PRO_KERALA_URL=https://prokerala.com

# Timeouts
SCRAPER_TIMEOUT=30000
API_TIMEOUT=30000

# Logging
LOG_LEVEL=info
LOG_DIR=/home/tamil-calendar/app/backend/logs

# Backup
BACKUP_ENABLED=true
BACKUP_DIR=/home/tamil-calendar/app/backend/backups
BACKUP_RETENTION_DAYS=30
```

### 7.3 Setup Database
```bash
cd /home/tamil-calendar/app/backend

# Run migrations
npm run migrate

# Seed admin user
npm run seed
```

### 7.4 Build Frontend
```bash
cd /home/tamil-calendar/app/frontend

npm install --production

# Build for production
npm run build

# Verify build output
ls -la dist/
```

### 7.5 Copy Frontend Build to Nginx
```bash
sudo cp -r /home/tamil-calendar/app/frontend/dist/* /home/tamil-calendar/frontend/dist/
sudo chown -R www-data:www-data /home/tamil-calendar/frontend/dist/
```

---

## 🔄 Step 8: Process Management with PM2

### 8.1 Install PM2 Globally
```bash
sudo npm install -g pm2

# Grant PM2 startup permissions
sudo pm2 startup systemd -u tamil-calendar --hp /home/tamil-calendar

# Give permissions
sudo chown -R tamil-calendar:tamil-calendar /home/tamil-calendar/.pm2
```

### 8.2 Create PM2 Configuration

As `tamil-calendar` user, create `ecosystem.config.js`:

```bash
cat > /home/tamil-calendar/app/ecosystem.config.js << 'EOF'
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
      error_file: '/home/tamil-calendar/app/backend/logs/pm2-error.log',
      out_file: '/home/tamil-calendar/app/backend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto restart
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.env'],
      max_memory_restart: '500M',
      
      // Graceful shutdown
      wait_ready: true,
      listen_timeout: 3000,
      kill_timeout: 5000,
      
      // Development
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  deploy: {
    production: {
      user: 'tamil-calendar',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-repo.git',
      path: '/home/tamil-calendar/app',
      'post-deploy': 'npm install && npm run migrate && pm2 restart ecosystem.config.js'
    }
  }
};
EOF
```

### 8.3 Start Backend with PM2
```bash
cd /home/tamil-calendar/app

# Start application
pm2 start ecosystem.config.js

# Save PM2 processes
pm2 save

# Verify
pm2 status
pm2 logs
```

---

## 🗂️ Step 9: Directory Structure Setup

```bash
# Create logs directory
mkdir -p /home/tamil-calendar/app/backend/logs
mkdir -p /home/tamil-calendar/app/backend/backups

# Create frontend dist directory
sudo mkdir -p /home/tamil-calendar/frontend/dist
sudo chown -R www-data:www-data /home/tamil-calendar/frontend/dist

# Create PM2 log directory
mkdir -p /home/tamil-calendar/.pm2/logs
```

---

## ✅ Step 10: Verification

### 10.1 Check Services Status
```bash
# PostgreSQL
sudo systemctl status postgresql

# Nginx
sudo systemctl status nginx

# PM2
pm2 status

# Check if backend is running
curl -I http://localhost:5000/api/public/today

# Check frontend access
curl -I http://localhost/
```

### 10.2 Test Database Connection
```bash
psql -U postgres -d tamil_calendar -h localhost -c "SELECT COUNT(*) FROM calendar;"
```

### 10.3 View Logs
```bash
# Nginx error logs
sudo tail -f /var/log/nginx/tamil-calendar-error.log

# Nginx access logs
sudo tail -f /var/log/nginx/tamil-calendar-access.log

# Backend logs
pm2 logs tamil-calendar-backend

# PM2 logs
tail -f /home/tamil-calendar/.pm2/logs/tamil-calendar-backend-error.log
```

---

## 🚀 Step 11: Startup & Management

### 11.1 Start Services on Boot
```bash
# PostgreSQL (already enabled)
sudo systemctl enable postgresql

# Nginx (already enabled)
sudo systemctl enable nginx

# PM2 (already configured)
pm2 startup
pm2 save
```

### 11.2 Useful Commands
```bash
# Restart backend
pm2 restart tamil-calendar-backend

# View logs
pm2 logs tamil-calendar-backend

# Stop backend
pm2 stop tamil-calendar-backend

# Reload Nginx
sudo systemctl reload nginx

# Restart PostgreSQL
sudo systemctl restart postgresql

# Monitor system
pm2 monit
```

---

## 🔧 Step 12: Maintenance

### 12.1 Database Backup
```bash
# Manual backup
cd /home/tamil-calendar/app/backend
npm run backup

# Automated backup (add to crontab)
crontab -e

# Add line:
# 0 2 * * * cd /home/tamil-calendar/app/backend && npm run backup
```

### 12.2 Log Rotation
```bash
sudo nano /etc/logrotate.d/tamil-calendar
```

Add:
```
/var/log/nginx/tamil-calendar-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}

/home/tamil-calendar/app/backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 tamil-calendar tamil-calendar
    sharedscripts
}
```

### 12.3 Monitor Resource Usage
```bash
# Install monitoring
sudo apt install -y nethogs iotop

# Monitor processes
top -u tamil-calendar

# Monitor network
sudo nethogs eth0

# Monitor disk I/O
sudo iotop
```

---

## 🐛 Troubleshooting

### Backend not connecting to database
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d tamil_calendar -h localhost

# Check .env file
cat /home/tamil-calendar/app/backend/.env
```

### Nginx not serving frontend
```bash
# Check Nginx config
sudo nginx -t

# Check file permissions
ls -la /home/tamil-calendar/frontend/dist/

# Check Nginx error log
sudo tail -f /var/log/nginx/tamil-calendar-error.log
```

### API not responding
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs tamil-calendar-backend

# Check if port 5000 is listening
sudo netstat -tlnp | grep 5000
```

### SSL Certificate issues
```bash
# Check certificate
sudo openssl x509 -in /etc/letsencrypt/live/tamil-calendar.local/fullchain.pem -text -noout

# Verify certificate chain
sudo openssl s_client -connect localhost:443 -showcerts
```

---

## 🔐 Security Hardening

### Fail2Ban Installation
```bash
sudo apt install -y fail2ban

# Create local config
sudo nano /etc/fail2ban/jail.local
```

Add:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[recidive]
enabled = true
```

Restart Fail2Ban:
```bash
sudo systemctl restart fail2ban
```

### SSH Hardening
```bash
sudo nano /etc/ssh/sshd_config
```

Modify:
```
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes
MaxAuthTries 3
```

Restart SSH:
```bash
sudo systemctl restart sshd
```

---

## 📊 Production Checklist

- [ ] PostgreSQL running and accessible
- [ ] Database credentials set securely
- [ ] Nginx configured and serving content
- [ ] SSL/TLS certificates installed
- [ ] Backend running via PM2
- [ ] Frontend built and deployed
- [ ] API responding on `/api/` routes
- [ ] Admin panel accessible
- [ ] Telegram bot configured
- [ ] Automated backups running
- [ ] Logs rotating properly
- [ ] Firewall rules in place
- [ ] SSH hardened
- [ ] Fail2Ban enabled
- [ ] System monitoring active
- [ ] Performance tested

---

## 📞 Getting Help

### Check Service Status
```bash
sudo systemctl status postgresql
sudo systemctl status nginx
pm2 status
```

### View Application Logs
```bash
# Backend
pm2 logs tamil-calendar-backend

# Nginx
sudo tail -f /var/log/nginx/tamil-calendar-error.log

# System
journalctl -u postgresql -f
```

### Performance Monitoring
```bash
# Real-time monitoring
pm2 monit

# Check disk usage
df -h

# Check memory
free -h

# Check CPU load
uptime
```

---

## ✨ What's Next

1. ✅ System configured
2. ✅ Database ready
3. ✅ Web server running
4. ✅ Application deployed
5. 🔄 Configure Telegram bot token
6. 🔄 Setup daily backups
7. 🔄 Monitor application performance

---

**Last Updated:** April 18, 2026  
**Ubuntu Version:** 24.04 LTS  
**Status:** ✅ Ready for Production  

வாழ்க தமிழ்! 🇹🇦
