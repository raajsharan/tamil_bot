# Ubuntu 24.04 Direct Installation - Quick Reference

## 📋 Complete Command Checklist

### Phase 1: System Preparation (5 minutes)

```bash
# Update system
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

# Install essentials
sudo apt install -y curl wget git build-essential python3 python3-pip htop nano vim unzip \
    software-properties-common apt-transport-https ca-certificates gnupg lsb-release \
    net-tools iotop nethogs jq

# Enable firewall
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

### Phase 2: PostgreSQL 16 (5 minutes)

```bash
# Add repository and install
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16 postgresql-contrib-16

# Enable and start
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE tamil_calendar;
CREATE USER postgres WITH PASSWORD 'Password@1234';
ALTER USER postgres WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE tamil_calendar TO postgres;
\c tamil_calendar
GRANT ALL ON SCHEMA public TO postgres;
EOF

# Test connection
psql -U postgres -d tamil_calendar -h localhost -c "SELECT version();"
```

### Phase 3: Node.js 18 LTS (3 minutes)

```bash
# Add NodeSource repository and install
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version

# Update npm
sudo npm install -g npm@latest
```

### Phase 4: Nginx Web Server (3 minutes)

```bash
# Install Nginx
sudo apt install -y nginx

# Enable and start
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify
nginx -v
sudo systemctl status nginx
```

### Phase 5: PM2 & Certbot (2 minutes)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verify
pm2 --version
certbot --version
```

### Phase 6: Create Application User (2 minutes)

```bash
# Create user
sudo useradd -m -s /bin/bash tamil-calendar

# Create directories
sudo mkdir -p /home/tamil-calendar/app
sudo mkdir -p /home/tamil-calendar/frontend/dist
sudo mkdir -p /home/tamil-calendar/.pm2/logs
sudo chown -R tamil-calendar:tamil-calendar /home/tamil-calendar

# Switch to app user
sudo su - tamil-calendar
```

---

## 🚀 Phase 7: Application Deployment

### Step 1: Copy Application Files
```bash
# As tamil-calendar user (if not already)
sudo su - tamil-calendar

# Copy backend
cp -r /path/to/backend /home/tamil-calendar/app/

# Copy frontend
cp -r /path/to/frontend /home/tamil-calendar/app/

# Verify
ls -la /home/tamil-calendar/app/
```

### Step 2: Install Backend Dependencies
```bash
cd /home/tamil-calendar/app/backend

# Install production dependencies
npm install --production

# Create .env file
cat > .env << 'EOF'
# Environment
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
JWT_SECRET=your-super-secret-key-32-characters-long
JWT_EXPIRY=7d

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
TELEGRAM_CHANNEL_ID=your-channel-id

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
EOF

# Create log directory
mkdir -p logs backups

# Verify .env file
cat .env
```

### Step 3: Initialize Database
```bash
# Run migrations (creates tables)
npm run migrate

# Seed admin user (creates first admin)
npm run seed

# Follow the prompts to create admin account
```

### Step 4: Build Frontend
```bash
cd /home/tamil-calendar/app/frontend

# Install production dependencies
npm install --production

# Build for production
npm run build

# Verify build output
ls -la dist/

# Copy to Nginx directory
sudo cp -r dist/* /home/tamil-calendar/frontend/dist/
sudo chown -R www-data:www-data /home/tamil-calendar/frontend/dist/
```

### Step 5: Configure Nginx
```bash
# Create Nginx site config
sudo tee /etc/nginx/sites-available/tamil-calendar > /dev/null << 'EOF'
upstream backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    client_max_body_size 50M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        root /home/tamil-calendar/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }

    access_log /var/log/nginx/tamil-calendar-access.log;
    error_log /var/log/nginx/tamil-calendar-error.log;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/tamil-calendar /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 6: Configure PM2
```bash
# Back to tamil-calendar user directory
cd /home/tamil-calendar/app

# Create PM2 config
cat > ecosystem.config.js << 'EOF'
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
      max_memory_restart: '500M',
      wait_ready: true,
      listen_timeout: 3000,
      kill_timeout: 5000
    }
  ]
};
EOF

# Start backend with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Configure PM2 startup
sudo pm2 startup systemd -u tamil-calendar --hp /home/tamil-calendar

# Verify
pm2 status
pm2 logs
```

---

## ✅ Verification

```bash
# Check all services
sudo systemctl status postgresql
sudo systemctl status nginx
pm2 status

# Test API
curl http://localhost:5000/api/public/today

# Test frontend
curl -I http://localhost/

# Check logs
tail -f /var/log/nginx/tamil-calendar-error.log
pm2 logs tamil-calendar-backend

# Check database
psql -U postgres -d tamil_calendar -c "SELECT COUNT(*) FROM calendar;"
```

---

## 🔐 SSL/TLS Setup (Let's Encrypt)

```bash
# For production with real domain
sudo certbot certonly --nginx -d your-domain.com --agree-tos -m admin@example.com

# For local testing (self-signed)
sudo mkdir -p /etc/letsencrypt/live/tamil-calendar.local
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/letsencrypt/live/tamil-calendar.local/privkey.pem \
  -out /etc/letsencrypt/live/tamil-calendar.local/fullchain.pem \
  -subj "/C=IN/ST=Tamil Nadu/L=Chennai/O=Tamil Calendar/CN=tamil-calendar.local"

# Update Nginx config with SSL
sudo sed -i "s|listen 80;|listen 80;\n    listen 443 ssl http2;|" /etc/nginx/sites-available/tamil-calendar

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🛠️ Maintenance Commands

```bash
# Restart backend
pm2 restart tamil-calendar-backend

# View backend logs
pm2 logs tamil-calendar-backend

# Monitor resources
pm2 monit

# Backup database
cd /home/tamil-calendar/app/backend
npm run backup

# Check disk usage
df -h

# Check memory
free -h

# Reload Nginx
sudo systemctl reload nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 📊 Monitor System Health

```bash
# Real-time monitoring
pm2 monit

# Check open ports
sudo netstat -tlnp | grep -E ':(80|443|5000|5432)'

# Check process resources
top -u tamil-calendar

# Monitor network
sudo nethogs eth0

# Monitor disk I/O
sudo iotop
```

---

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs tamil-calendar-backend

# Try starting directly
cd /home/tamil-calendar/app/backend
node server.js

# Check .env file
cat .env
```

### Database connection error
```bash
# Check PostgreSQL running
sudo systemctl status postgresql

# Test connection manually
psql -U postgres -d tamil_calendar -h localhost

# Check credentials in .env
cat /home/tamil-calendar/app/backend/.env
```

### Nginx not serving content
```bash
# Check Nginx config
sudo nginx -t

# Check file permissions
ls -la /home/tamil-calendar/frontend/dist/

# View Nginx error log
sudo tail -f /var/log/nginx/tamil-calendar-error.log
```

### Port already in use
```bash
# Check what's using port 5000
sudo lsof -i :5000

# Check port 80
sudo lsof -i :80

# Check port 443
sudo lsof -i :443
```

---

## 📝 Quick Command Reference

| Task | Command |
|------|---------|
| Install system deps | `sudo bash deployment/ubuntu-24-04-install.sh` |
| Start backend | `pm2 start ecosystem.config.js` |
| Stop backend | `pm2 stop tamil-calendar-backend` |
| Restart backend | `pm2 restart tamil-calendar-backend` |
| View logs | `pm2 logs tamil-calendar-backend` |
| Reload Nginx | `sudo systemctl reload nginx` |
| Restart Nginx | `sudo systemctl restart nginx` |
| Check Nginx | `sudo nginx -t` |
| Database backup | `npm run backup` |
| Database status | `sudo systemctl status postgresql` |
| System monitor | `pm2 monit` |

---

## ⏱️ Total Installation Time

- System setup: **5 minutes**
- PostgreSQL: **5 minutes**
- Node.js: **3 minutes**
- Nginx: **3 minutes**
- PM2 & Certbot: **2 minutes**
- Create user: **2 minutes**
- **Total: ~20 minutes**

Then:
- Application setup: **10 minutes**
- Nginx configuration: **5 minutes**
- **Total deployment: ~35 minutes**

---

## 🎯 You're Ready!

Once all steps are complete:

✅ Access frontend: `http://your-server-ip`  
✅ Access admin: `http://your-server-ip/admin/login`  
✅ API endpoint: `http://your-server-ip/api`  

---

**Status:** ✅ Ready for Production  
**Last Updated:** April 18, 2026  
**Ubuntu Version:** 24.04 LTS  

வாழ்க தமிழ்! 🇹🇦
