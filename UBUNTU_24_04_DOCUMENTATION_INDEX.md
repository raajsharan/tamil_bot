# 🎯 Tamil Calendar Project - Ubuntu 24.04 Direct Installation
## Complete Documentation Index

---

## 🚀 **START HERE** (Choose Your Path)

### Path 1: Ubuntu 24.04 Direct Installation (No Docker) ⭐ **RECOMMENDED FOR YOU**
You selected: **Direct installation with Nginx and PostgreSQL**

**Quick Navigation:**
1. 👉 **[UBUNTU_24_04_START_HERE.md](UBUNTU_24_04_START_HERE.md)** - Entry point
2. 📖 **[UBUNTU_24_04_MASTER_GUIDE.md](UBUNTU_24_04_MASTER_GUIDE.md)** - Complete overview (20 min)
3. 🔧 **[UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md)** - Detailed steps (45 min)
4. ⚡ **[UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md)** - Copy-paste commands
5. 🚀 **[UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)** - Deploy application

**Installation Scripts:**
- 🔧 `deployment/ubuntu-24-04-install.sh` - Automated system setup
- ✅ `deployment/verify-installation.sh` - Verification tool

**Total Time: ~50 minutes**

---

### Path 2: Docker Installation (Alternative)
If you prefer Docker-based deployment:
- 📖 [DEPLOYMENT.md](DEPLOYMENT.md) - Docker deployment guide

---

## 📚 Complete Documentation Structure

### Ubuntu 24.04 Direct Installation (NEW - For Direct Deployment)
```
├── UBUNTU_24_04_START_HERE.md ⭐ START HERE
├── UBUNTU_24_04_MASTER_GUIDE.md - Overview & checklist
├── UBUNTU_24_04_SETUP.md - 12-step technical guide
├── UBUNTU_24_04_QUICK_REFERENCE.md - Command reference
├── UBUNTU_24_04_POST_DEPLOYMENT.md - Deploy your application
├── deployment/
│   ├── ubuntu-24-04-install.sh - Automated installer
│   └── verify-installation.sh - Verification tool
```

### General Project Documentation
```
├── GETTING_STARTED.md - General quick start
├── INDEX.md - General project index
├── FILES_GUIDE.md - File structure overview
├── IMPLEMENTATION.md - Technical implementation details
├── API.md - API endpoints reference
├── DEPLOYMENT.md - Docker deployment guide
├── TROUBLESHOOTING.md - Common issues & solutions
├── README.md - Project overview
├── PROJECT_STRUCTURE.md - Architecture overview
├── COMPLETION_SUMMARY.md - What was built
└── VERIFICATION.md - File generation verification
```

---

## 🎯 Your Setup Path (Ubuntu 24.04 Direct Installation)

### Step 1: Preparation (Before Installation)
**Read:** [UBUNTU_24_04_MASTER_GUIDE.md](UBUNTU_24_04_MASTER_GUIDE.md) → Section "System Requirements"

**Checklist:**
- [ ] Ubuntu 24.04 LTS server ready
- [ ] SSH access configured
- [ ] Sudo privileges available
- [ ] Internet connectivity confirmed
- [ ] Minimum 2GB RAM, 20GB storage

---

### Step 2: System Installation (15 minutes)
**Files:** 
- Primary: [deployment/ubuntu-24-04-install.sh](deployment/ubuntu-24-04-install.sh)
- Reference: [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md) → Steps 1-8

**Command:**
```bash
sudo bash deployment/ubuntu-24-04-install.sh
```

**What Gets Installed:**
- PostgreSQL 16
- Node.js 18 LTS
- Nginx web server
- PM2 process manager
- Certbot (SSL/TLS)
- UFW firewall
- Application user account

---

### Step 3: Verification (2 minutes)
**File:** [deployment/verify-installation.sh](deployment/verify-installation.sh)

**Command:**
```bash
bash deployment/verify-installation.sh
```

**Verifies:**
- All packages installed
- Services running
- Database accessible
- Ports listening
- Directory structure

---

### Step 4: Application Deployment (25 minutes)
**File:** [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)

**Steps:**
1. Copy application files to `/home/tamil-calendar/app/`
2. Install backend dependencies
3. Configure `.env` file
4. Run database migrations
5. Create admin user
6. Build frontend
7. Configure Nginx
8. Setup SSL certificates
9. Start PM2 process manager
10. Verify everything works

---

## 📖 How to Use This Documentation

### For Quick Command Reference
→ Use: [UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md)
- All commands in one place
- Copy-paste ready
- No explanations, just commands

### For Step-by-Step Installation
→ Read: [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md)
- 12 detailed steps
- Everything explained
- Security considerations included
- Troubleshooting for each phase

### For Quick Overview
→ Read: [UBUNTU_24_04_MASTER_GUIDE.md](UBUNTU_24_04_MASTER_GUIDE.md)
- 20-minute read
- All phases explained
- Quick reference included
- Checklist provided

### For Post-Installation Deployment
→ Follow: [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)
- After system is ready
- Deploy your application
- Test everything
- Production ready

### For API Reference
→ Check: [API.md](API.md)
- 19 API endpoints
- Request/response examples
- Authentication details

### For API Documentation
→ Read: [IMPLEMENTATION.md](IMPLEMENTATION.md)
- Technical architecture
- Database schema
- Feature documentation

### For Troubleshooting
→ See: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Common issues
- Solutions
- Debug commands

---

## 🔄 Complete Installation Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: PREPARATION                                           │
│  • Read: UBUNTU_24_04_MASTER_GUIDE.md                          │
│  • Verify system meets requirements                             │
│  • Time: 5 minutes                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: AUTOMATED INSTALLATION                                │
│  • Run: sudo bash deployment/ubuntu-24-04-install.sh           │
│  • Installs: PostgreSQL, Node.js, Nginx, PM2, Certbot          │
│  • Time: 15 minutes                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: VERIFICATION                                          │
│  • Run: bash deployment/verify-installation.sh                 │
│  • Confirms all components installed                            │
│  • Time: 2 minutes                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: APPLICATION DEPLOYMENT                                │
│  • Follow: UBUNTU_24_04_POST_DEPLOYMENT.md                     │
│  • Deploy backend & frontend                                   │
│  • Configure Nginx & PM2                                       │
│  • Time: 25 minutes                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  DONE! Your application is running                              │
│  • Frontend: http://your-server-ip                             │
│  • Admin: http://your-server-ip/admin/login                   │
│  • API: http://your-server-ip/api                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Access Points After Installation

| Component | URL/Location | Access |
|-----------|-------------|--------|
| Frontend | http://server-ip | Public |
| Admin Panel | http://server-ip/admin/login | Auth required |
| API | http://server-ip/api | Public/Auth |
| Backend Server | http://server-ip:5000 | Internal |
| PostgreSQL | localhost:5432 | Internal |
| Health Check | http://server-ip/health | Public |

---

## 📋 Service Management After Installation

### Start/Stop Services
```bash
# Backend (PM2)
pm2 start tamil-calendar-backend
pm2 stop tamil-calendar-backend
pm2 restart tamil-calendar-backend

# Nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

# PostgreSQL
sudo systemctl start postgresql
sudo systemctl stop postgresql
```

### View Logs
```bash
# Backend logs
pm2 logs tamil-calendar-backend

# Nginx access log
sudo tail -f /var/log/nginx/tamil-calendar-access.log

# Nginx error log
sudo tail -f /var/log/nginx/tamil-calendar-error.log

# Database logs
journalctl -u postgresql -f
```

### Monitor System
```bash
# PM2 monitoring
pm2 monit

# System resources
top -u tamil-calendar

# Disk usage
df -h

# Memory usage
free -h
```

---

## 🔐 Security After Installation

✅ **Already Configured:**
- UFW firewall enabled
- SSH port limited (22)
- HTTP (80) and HTTPS (443) allowed
- Rate limiting on API
- JWT authentication
- Password hashing (bcrypt)
- PostgreSQL local-only access

**Recommendations:**
- [ ] Change JWT secret in `.env`
- [ ] Use strong admin password
- [ ] Enable SSL certificates (Certbot)
- [ ] Configure SSH key-based auth
- [ ] Setup automated backups
- [ ] Regular security updates
- [ ] Monitor error logs

---

## 📊 System Requirements Recap

**Minimum:**
- Ubuntu 24.04 LTS
- 2 CPU cores
- 2 GB RAM
- 20 GB disk

**Recommended (Production):**
- 4+ CPU cores
- 4+ GB RAM
- 50+ GB disk
- SSD storage

---

## ✅ Installation Verification

After each phase, verify completion:

### After Phase 1
```bash
# Check system is updated
sudo apt list --upgradable
```

### After Phase 2
```bash
bash deployment/verify-installation.sh
# Should show all ✓ (checks)
```

### After Phase 3
```bash
# Check services
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

### After Phase 4
```bash
# Test API
curl http://localhost:5000/api/public/today

# Test frontend
curl http://localhost/
```

---

## 🐛 Troubleshooting Quick Links

| Problem | Solution | Reference |
|---------|----------|-----------|
| Can't SSH to server | Check network, IP address | UBUNTU_24_04_SETUP.md |
| Installation script fails | Run manually or check logs | UBUNTU_24_04_SETUP.md → Troubleshooting |
| PostgreSQL won't start | Check disk space, ports | UBUNTU_24_04_SETUP.md → Step 2 |
| Nginx not serving | Check config, file permissions | UBUNTU_24_04_POST_DEPLOYMENT.md → Troubleshooting |
| API not responding | Check PM2 logs, port 5000 | UBUNTU_24_04_POST_DEPLOYMENT.md → Troubleshooting |
| Database connection error | Verify .env credentials | UBUNTU_24_04_POST_DEPLOYMENT.md → Step 4 |

---

## 📞 Documentation Quick Links

| Topic | Document | Time |
|-------|----------|------|
| Getting started | UBUNTU_24_04_START_HERE.md | 5 min |
| Master guide | UBUNTU_24_04_MASTER_GUIDE.md | 20 min |
| Detailed steps | UBUNTU_24_04_SETUP.md | 45 min |
| Quick commands | UBUNTU_24_04_QUICK_REFERENCE.md | 10 min |
| Deploy app | UBUNTU_24_04_POST_DEPLOYMENT.md | 30 min |
| API reference | API.md | 15 min |
| Tech details | IMPLEMENTATION.md | 30 min |
| Problem solving | TROUBLESHOOTING.md | 10 min |
| General start | GETTING_STARTED.md | 5 min |

---

## 🎯 Next Step

👉 **Start with:** [UBUNTU_24_04_START_HERE.md](UBUNTU_24_04_START_HERE.md)

Or if you're ready for immediate installation:

```bash
# Run the automated installer
sudo bash deployment/ubuntu-24-04-install.sh
```

---

## ✨ You're All Set!

Your Ubuntu 24.04 LTS direct installation is fully documented and ready to deploy.

**Total Setup Time: ~50 minutes**
- System installation: 15 min
- Verification: 2 min
- Application deployment: 25 min

**Status: ✅ Production Ready**

வாழ்க தமிழ்! 🇹🇦

---

**Created:** April 18, 2026  
**Last Updated:** April 18, 2026  
**Version:** 1.0.0  
**Target OS:** Ubuntu 24.04 LTS  
