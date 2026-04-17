# 📅 Tamil Calendar & Panchangam - Deployment Guide

## 🚀 Quick Start (Ubuntu 20.04/22.04 LTS)

### Prerequisites
- Ubuntu 20.04 or 22.04 LTS
- Root or sudo access
- Domain name (for SSL)
- Telegram Bot Token (optional, for bot functionality)

---

## Phase 1: Server Setup

### 1.1 Run Installation Script

```bash
# Download and make executable
curl -fsSL https://your-domain/install.sh > install.sh
chmod +x install.sh

# Run as sudo
sudo bash install.sh
```

This script installs:
- Node.js 18 LTS
- MongoDB 6.0
- Nginx
- PM2
- Certbot (SSL/TLS)
- All required dependencies

**⏱️ Duration: ~10-15 minutes**

### 1.2 Verify Installation

```bash
# Check versions
node -v       # Should be v18.x or higher
npm -v        # Should be 9.x or higher
mongod --version
nginx -v
pm2 -v
```

---

## Phase 2: Application Setup

### 2.1 Clone Repository

```bash
cd /home/tamil-calendar
git clone https://github.com/yourusername/tamil-calendar.git .
```

### 2.2 Setup Backend

```bash
cd /home/tamil-calendar/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit configuration
nano .env
```

**Update these values in .env:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tamil-calendar
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your-super-secret-key-change-this
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHANNEL_ID=-1001234567890
```

### 2.3 Initialize Database & Admin User

```bash
# Create admin user (interactive)
npm run seed

# Follow prompts:
# - Admin Name: [Your Name]
# - Email: admin@tamil-calendar.local
# - Password: (min 8 characters)
```

### 2.4 Setup Frontend

```bash
cd /home/tamil-calendar/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Output will be in: /home/tamil-calendar/frontend/build
```

### 2.5 Copy Frontend to Nginx

```bash
# Copy built frontend to Nginx root
sudo cp -r /home/tamil-calendar/frontend/build/* /var/www/tamil-calendar/

# Set permissions
sudo chown -R www-data:www-data /var/www/tamil-calendar
sudo chmod -R 755 /var/www/tamil-calendar
```

---

## Phase 3: Nginx Configuration

### 3.1 Install Nginx Config

```bash
# Copy Nginx configuration
sudo cp /home/tamil-calendar/nginx/tamil-calendar.conf /etc/nginx/sites-available/

# Create symlink
sudo ln -s /etc/nginx/sites-available/tamil-calendar.conf /etc/nginx/sites-enabled/

# Disable default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3.2 Setup SSL with Let's Encrypt

```bash
# Obtain certificate
sudo certbot certonly --nginx \
  -d your-domain.com \
  -d www.your-domain.com \
  --agree-tos \
  --non-interactive \
  -m your-email@domain.com

# Auto-renew (should be automatic)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify renewal
sudo certbot renew --dry-run
```

---

## Phase 4: Application Deployment

### 4.1 Start with PM2

```bash
cd /home/tamil-calendar

# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start pm2/ecosystem.config.js --env production

# View status
pm2 status

# View logs
pm2 logs tamil-calendar-api
pm2 logs tamil-calendar-web
```

### 4.2 Setup PM2 Startup

```bash
# Make PM2 start on system boot
sudo pm2 startup systemd -u tamil-calendar --hp /home/tamil-calendar

# Save PM2 process list
pm2 save

# Verify
sudo systemctl status pm2-tamil-calendar
```

### 4.3 Monitor Application

```bash
# Real-time monitoring
pm2 monit

# Show all processes
pm2 list

# Show logs (live)
pm2 logs

# Show specific app logs
pm2 logs tamil-calendar-api

# Restart app
pm2 restart tamil-calendar-api

# Stop app
pm2 stop tamil-calendar-api
```

---

## Phase 5: Verification

### 5.1 Test API Endpoints

```bash
# Health check
curl https://your-domain.com/health

# Public API
curl https://your-domain.com/api/public/today

# Admin login (get token)
curl -X POST https://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@tamil-calendar.local", "password": "your-password"}'

# Use token in requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-domain.com/api/admin/profile
```

### 5.2 Check Logs

```bash
# Nginx error log
sudo tail -f /var/log/nginx/tamil-calendar-error.log

# Nginx access log
sudo tail -f /var/log/nginx/tamil-calendar-access.log

# PM2 logs
pm2 logs

# MongoDB status
systemctl status mongod

# Application logs (if running in foreground)
pm2 logs tamil-calendar-api
```

---

## Phase 6: Configuration & Customization

### 6.1 Database Backup

```bash
# Backup MongoDB
mongodump --db tamil-calendar --out /backup/mongodb/

# Restore MongoDB
mongorestore --db tamil-calendar /backup/mongodb/tamil-calendar

# Backup schedule (add to crontab)
0 2 * * * mongodump --db tamil-calendar --out /backup/mongodb/$(date +\%Y\%m\%d)
```

### 6.2 Update Environment Variables

```bash
# Edit backend .env
nano /home/tamil-calendar/backend/.env

# Restart application
pm2 restart tamil-calendar-api
```

### 6.3 Update Frontend

```bash
# Pull latest code
cd /home/tamil-calendar
git pull origin main

# Rebuild frontend
cd frontend
npm install
npm run build

# Copy to Nginx
sudo cp -r build/* /var/www/tamil-calendar/
```

---

## 🔄 Cron Jobs & Automation

### Daily Update (4:30 AM IST)
Automatically triggered by the application.

### Weekly Backup (Sunday 2 AM)
```bash
# Add to crontab
crontab -e

# Add line:
0 2 * * 0 mongodump --db tamil-calendar --out /backup/mongodb/backup_$(date +\%Y\%m\%d)
```

### Check Cron Status
```bash
# View all cron jobs
sudo systemctl list-timers

# View specific
sudo journalctl -u pm2-tamil-calendar -f
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB status
systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check logs
sudo journalctl -u mongod -f

# Reset MongoDB
sudo systemctl stop mongod
sudo rm /var/lib/mongodb/mongod.lock
sudo systemctl start mongod
```

### Nginx Not Responding

```bash
# Test configuration
sudo nginx -t

# Check if running
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# Check ports
sudo netstat -tlnp | grep nginx
sudo netstat -tlnp | grep 5000
```

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs

# Check Node.js errors
pm2 logs --lines 100

# Restart with debug
pm2 delete tamil-calendar-api
pm2 start backend/server.js --name tamil-calendar-api

# Check process limits
ulimit -a
```

### High CPU/Memory Usage

```bash
# Monitor in real-time
pm2 monit

# Check specific process
ps aux | grep node

# Kill zombie processes
pm2 kill
pm2 start pm2/ecosystem.config.js --env production
```

---

## 📊 System Monitoring

### Setup Monitoring

```bash
# Install system monitoring
sudo apt-get install htop iotop

# Real-time monitoring
htop

# Disk usage
df -h

# Memory usage
free -h

# Network monitoring
netstat -tulpn
```

### PM2 Plus (Optional - Paid)

```bash
# Link to PM2 Plus
pm2 link (requires PM2 Plus account)

# Monitor from web dashboard
# https://app.pm2.io
```

---

## 🔐 Security Checklist

- [ ] Change MongoDB default port
- [ ] Enable MongoDB authentication
- [ ] Configure firewall (UFW)
- [ ] Setup SSL certificates
- [ ] Change JWT_SECRET
- [ ] Disable root login
- [ ] Setup SSH keys only (no password)
- [ ] Enable fail2ban
- [ ] Setup automatic updates
- [ ] Regular backups

### Setup Fail2Ban (Optional)

```bash
sudo apt-get install fail2ban

# Copy config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Enable
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

---

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Already configured in nginx.conf

### 2. Setup Caching

```bash
# Add to Nginx config for static files
location ~* \.(js|css|png|jpg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Indexing
Already configured in models

### 4. PM2 Cluster Mode
Already enabled in ecosystem.config.js

---

## 📱 Telegram Bot Setup

### 1. Create Bot on BotFather

```
1. Open Telegram
2. Search @BotFather
3. /newbot
4. Enter bot name and username
5. Copy token
```

### 2. Create Channel

```
1. Create public channel
2. Get channel username
3. Add bot as admin
```

### 3. Update .env

```env
TELEGRAM_BOT_TOKEN=your-token-here
TELEGRAM_CHANNEL_ID=-100xxxxxxxxxx
```

### 4. Test Bot

```bash
# Send manual message
curl -X POST https://api.telegram.org/botYOUR_TOKEN/sendMessage \
  -d chat_id=-100xxxxxxxxxx \
  -d text="Test message"
```

---

## 🎯 Admin Panel Access

### First Login

1. Navigate to: `https://your-domain.com/admin`
2. Email: `admin@tamil-calendar.local`
3. Password: (the one you set during seed)
4. Click "Login"

### Admin Features

- **Dashboard**: System stats, recent activity
- **Calendar Manager**: Edit/override calendar data
- **Scraper Control**: Trigger manual scrapes
- **Logs & Audit**: Track all system activities
- **User Management**: Add more admins

---

## 🔄 Updates & Maintenance

### Update Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Update MongoDB

```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Update Application

```bash
cd /home/tamil-calendar
git pull origin main
npm install
npm run build
pm2 restart all
```

---

## 📞 Support & Troubleshooting

### Get System Info

```bash
uname -a
cat /etc/os-release
npm -v && node -v
pm2 -v
nginx -v
mongod --version
```

### Debug Mode

```bash
# Run backend in debug mode
NODE_ENV=development npm start

# Watch for changes
npm run dev
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `sudo lsof -i :5000` then `kill -9 PID` |
| MongoDB won't start | Check disk space: `df -h` |
| SSL certificate expired | `sudo certbot renew --force-renewal` |
| High memory usage | Restart app: `pm2 restart all` |
| Slow performance | Check MongoDB indexes, enable caching |

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Nginx Documentation](https://nginx.org/en/docs)
- [PM2 Documentation](https://pm2.keymetrics.io)
- [Let's Encrypt](https://letsencrypt.org)

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained By**: Your Team
