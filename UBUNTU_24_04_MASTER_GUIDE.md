# 🐧 Ubuntu 24.04 LTS Direct Installation - Complete Guide

**Target:** Direct installation on Ubuntu 24.04 LTS (NO Docker)  
**Status:** ✅ Production Ready  
**Total Setup Time:** ~50 minutes  

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Installation Phases](#installation-phases)
4. [Quick Navigation](#quick-navigation)
5. [Support & Troubleshooting](#support--troubleshooting)

---

## 🎯 Overview

This is a **complete guide for direct installation** of the Tamil Calendar application on a fresh Ubuntu 24.04 LTS server using:

- ✅ **PostgreSQL 16** - Native database (not Docker)
- ✅ **Node.js 18 LTS** - Backend runtime
- ✅ **Nginx** - Web server & reverse proxy
- ✅ **PM2** - Process manager
- ✅ **UFW** - Firewall
- ✅ **Certbot** - SSL/TLS certificates

**NO Docker - Everything runs natively on the system!**

---

## 💻 System Requirements

### Minimum Specifications
- **Ubuntu:** 24.04 LTS (Noble Numbat) - fresh install
- **CPU:** 2 cores (4 recommended for production)
- **RAM:** 2 GB minimum (4 GB recommended)
- **Storage:** 20 GB available space
- **Network:** Static IP (recommended)

### Network Requirements
- SSH access (port 22)
- HTTP access (port 80)
- HTTPS access (port 443)
- PostgreSQL (port 5432, localhost only)

### Pre-Installation
- [ ] Ubuntu 24.04 LTS fresh install
- [ ] SSH access with sudo privileges
- [ ] Domain name (for SSL certificates)
- [ ] Internet connectivity
- [ ] Application files ready

---

## 🚀 Installation Phases

### Phase 1: System Preparation (5 min)
**File:** [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md) - Step 1  
**Tasks:**
- Update system packages
- Install essential tools
- Configure firewall (UFW)

**Command:**
```bash
sudo apt update && sudo apt upgrade -y
```

---

### Phase 2: Automated Dependency Installation (15 min)
**File:** [deployment/ubuntu-24-04-install.sh](deployment/ubuntu-24-04-install.sh)  
**Installs:**
- PostgreSQL 16
- Node.js 18 LTS
- Nginx
- PM2
- Certbot
- Create application user

**Command:**
```bash
sudo bash deployment/ubuntu-24-04-install.sh
```

---

### Phase 3: Verification (2 min)
**File:** [deployment/verify-installation.sh](deployment/verify-installation.sh)  
**Checks:**
- All components installed
- Services running
- Database accessible
- Ports listening
- Directory structure

**Command:**
```bash
bash deployment/verify-installation.sh
```

---

### Phase 4: Application Deployment (25 min)
**File:** [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)  
**Steps:**
- Copy application files
- Install backend dependencies
- Configure `.env` file
- Initialize database
- Create admin user
- Build frontend
- Configure Nginx
- Setup SSL certificates
- Start PM2 process manager

---

## 🗂️ Complete File Structure

```
d:\Projects\Four\
├── 📄 UBUNTU_24_04_SETUP.md
│   └── Comprehensive installation guide (12 steps)
│
├── 📄 UBUNTU_24_04_QUICK_REFERENCE.md
│   └── Quick command reference (all phases)
│
├── 📄 UBUNTU_24_04_POST_DEPLOYMENT.md
│   └── Deployment guide after system setup
│
├── 📁 deployment/
│   ├── 🔧 ubuntu-24-04-install.sh
│   │   └── Automated system installation
│   │
│   └── ✅ verify-installation.sh
│       └── Verify all components installed
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scrapers/
│   ├── cron/
│   └── scripts/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── [other documentation files]
```

---

## ⚡ Quick Start (Copy-Paste Instructions)

### Step 1: System Installation (15 minutes)

```bash
# Connect to your Ubuntu 24.04 server
ssh user@your-server-ip

# Download and run installation script
sudo bash deployment/ubuntu-24-04-install.sh

# Wait for completion, then verify
bash deployment/verify-installation.sh
```

### Step 2: Application Setup (25 minutes)

```bash
# Switch to application user
sudo su - tamil-calendar

# Copy application files (from local machine)
# scp -r backend tamil-calendar@server-ip:/home/tamil-calendar/app/
# scp -r frontend tamil-calendar@server-ip:/home/tamil-calendar/app/

# Setup backend
cd /home/tamil-calendar/app/backend
npm install --production
nano .env  # Configure database & API settings
npm run migrate
npm run seed

# Build frontend
cd ../frontend
npm install --production
npm run build

# Deploy to Nginx
sudo cp -r dist/* /home/tamil-calendar/frontend/dist/

# Configure Nginx & start backend
# (Follow UBUNTU_24_04_POST_DEPLOYMENT.md)
pm2 start ecosystem.config.js
```

### Step 3: Access Application

```
Frontend:  http://your-server-ip
Admin:     http://your-server-ip/admin/login
API:       http://your-server-ip/api/public/today
```

---

## 📖 Quick Navigation

### Getting Started
1. **First time?** → Read [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md) (15 min read)
2. **Want quick commands?** → Check [UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md)
3. **System ready, deploying app?** → Follow [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)

### Installation Scripts
- **System Setup:** `sudo bash deployment/ubuntu-24-04-install.sh`
- **Verify Setup:** `bash deployment/verify-installation.sh`
- **Deploy App:** Follow [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)

### Troubleshooting
- **PostgreSQL issues:** Section in [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md) → Step 2
- **Nginx problems:** Section in [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md) → Troubleshooting
- **Application won't start:** Check PM2 logs: `pm2 logs tamil-calendar-backend`

---

## 🔧 Configuration Files

### Backend .env Template
```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tamil_calendar
DB_USER=postgres
DB_PASSWORD=Password@1234
PORT=5000
JWT_SECRET=your-super-secret-key-32-chars-long
```

### Nginx Configuration
Location: `/etc/nginx/sites-available/tamil-calendar`
- Reverse proxy to backend (port 5000)
- Serves frontend static files
- Rate limiting
- SSL/TLS support

### PM2 Configuration
Location: `/home/tamil-calendar/app/ecosystem.config.js`
- Cluster mode (auto-scales)
- Auto-restart on crash
- Memory limit (500MB)
- Log rotation

---

## 🌐 Service Ports

| Service | Port | Type | Status |
|---------|------|------|--------|
| SSH | 22 | TCP | Open (firewall) |
| HTTP | 80 | TCP | Open (firewall) |
| HTTPS | 443 | TCP | Open (firewall) |
| Backend API | 5000 | TCP | Internal (localhost) |
| PostgreSQL | 5432 | TCP | Internal (localhost) |
| Health Check | - | HTTP | `/health` endpoint |

---

## ✅ Pre-Installation Verification

Before starting, verify:

```bash
# Check Ubuntu version
lsb_release -a
# Should show: Ubuntu 24.04 LTS

# Check internet connectivity
ping 8.8.8.8

# Check sudo access
sudo whoami
# Should output: root

# Check disk space
df -h /
# Should have at least 20GB free

# Check network connectivity
curl -I https://www.google.com
```

---

## 📊 Installation Timeline

| Phase | Time | Tasks |
|-------|------|-------|
| System Prep | 5 min | Update packages, firewall |
| Auto Install | 15 min | Install dependencies |
| Verification | 2 min | Verify installation |
| App Setup | 25 min | Deploy application |
| **TOTAL** | **~50 min** | **Complete setup** |

---

## 🔒 Security Considerations

✅ **Built-in Security Features:**
- UFW firewall enabled
- SSH hardening ready
- Rate limiting on API
- JWT authentication
- HTTPS/SSL support
- PostgreSQL password protected
- PM2 auto-restart with monitoring
- Account lockout mechanism
- Automated backups

**Recommendations:**
- [ ] Change default JWT secret
- [ ] Use strong admin password
- [ ] Enable SSL certificates (Certbot)
- [ ] Configure SSH key-based auth
- [ ] Setup monitoring/alerts
- [ ] Regular database backups
- [ ] Keep system updated

---

## 📞 Getting Help

### Common Issues

**Database Connection Failed:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d tamil_calendar
```

**Backend won't start:**
```bash
# Check PM2 logs
pm2 logs tamil-calendar-backend

# Check port 5000
sudo netstat -tlnp | grep 5000
```

**Nginx not serving content:**
```bash
# Test config
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/tamil-calendar-error.log
```

### Documentation Resources

| Issue | Reference |
|-------|-----------|
| Installation | [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md) |
| Quick Commands | [UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md) |
| Deployment | [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md) |
| General Troubleshooting | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| API Reference | [API.md](API.md) |

---

## 🎯 Deployment Checklist

### Pre-Installation
- [ ] Ubuntu 24.04 LTS server ready
- [ ] SSH access configured
- [ ] Firewall rules prepared
- [ ] Domain/IP address available

### During Installation
- [ ] System packages updated
- [ ] PostgreSQL 16 installed
- [ ] Node.js 18 installed
- [ ] Nginx installed
- [ ] PM2 installed
- [ ] Application user created

### Post-Installation
- [ ] Application files deployed
- [ ] Backend dependencies installed
- [ ] Database migrations run
- [ ] Admin user created
- [ ] Frontend built
- [ ] Nginx configured
- [ ] SSL certificates installed
- [ ] PM2 started
- [ ] Services auto-start enabled

### Verification
- [ ] PostgreSQL running
- [ ] Nginx running
- [ ] Backend responding (port 5000)
- [ ] Frontend accessible (port 80/443)
- [ ] Database populated
- [ ] Admin login working

---

## 🚀 After Deployment

Once everything is running:

1. **Configure Telegram Bot** (optional)
   - Get bot token from @BotFather
   - Update `.env` with credentials
   - Restart backend: `pm2 restart tamil-calendar-backend`

2. **Setup Custom Domain** (recommended)
   - Point domain to server IP
   - Get SSL certificate: `sudo certbot --nginx`
   - Update Nginx config

3. **Setup Monitoring** (recommended)
   - Monitor PM2: `pm2 monit`
   - Monitor system: `top`, `df`, `free`
   - Check logs daily

4. **Configure Backups** (important)
   - Automated daily backups enabled
   - Store backups externally
   - Test restore process

---

## 📞 Support

### Logs Locations
```
Nginx Access:    /var/log/nginx/tamil-calendar-access.log
Nginx Error:     /var/log/nginx/tamil-calendar-error.log
Backend Logs:    /home/tamil-calendar/app/backend/logs/
PM2 Logs:        ~/.pm2/logs/
PostgreSQL:      /var/log/postgresql/
System Journal:  journalctl
```

### Check Service Status
```bash
# All services
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql

# Check ports
sudo netstat -tlnp | grep -E ':(80|443|5000|5432)'

# Monitor resources
pm2 monit
top -u tamil-calendar
```

---

## ✨ What's Included

✅ **Backend (18 files)**
- Express.js REST API
- PostgreSQL integration
- JWT authentication
- 3 web scrapers
- Telegram bot
- Cron jobs
- Admin panel API

✅ **Frontend (15 files)**
- React 18 app
- Responsive UI
- Admin dashboard
- Tailwind CSS styling
- API integration
- State management

✅ **Infrastructure**
- Nginx configuration
- PM2 setup
- UFW firewall
- SSL/TLS ready
- Auto-restart scripts

✅ **Documentation**
- 12+ setup guides
- API documentation
- Troubleshooting guide
- Quick reference

---

## 🎉 You're Ready!

Your Tamil Calendar application is ready for deployment on Ubuntu 24.04 LTS!

### Next Steps:
1. Read [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md)
2. Run `sudo bash deployment/ubuntu-24-04-install.sh`
3. Run `bash deployment/verify-installation.sh`
4. Follow [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)
5. Access your application!

---

**Created:** April 18, 2026  
**Ubuntu Version:** 24.04 LTS  
**Status:** ✅ Production Ready  
**Estimated Setup Time:** ~50 minutes  

**வாழ்க தமிழ்! 🇹🇦**
