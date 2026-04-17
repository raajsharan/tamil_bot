# 📋 Ubuntu 24.04 Direct Installation - Quick Start

**Choose your path below and follow the links:**

## 🚀 I'm Ready to Deploy NOW!

### Quick Command Setup (Copy & Paste)

```bash
# 1. Run system installation (15 min)
sudo bash deployment/ubuntu-24-04-install.sh

# 2. Verify installation (2 min)
bash deployment/verify-installation.sh

# 3. Deploy application (25 min)
# Follow guide: UBUNTU_24_04_POST_DEPLOYMENT.md
```

**Total Time: ~50 minutes**

---

## 📚 Choose Your Learning Style

### Option 1: Step-by-Step (Recommended for First Time)
👉 **Read:** [UBUNTU_24_04_MASTER_GUIDE.md](UBUNTU_24_04_MASTER_GUIDE.md)
- Complete overview
- All phases explained
- Troubleshooting included
- **Time: 30 minutes read**

### Option 2: Full Technical Details
👉 **Read:** [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md)
- 12-step installation guide
- Every command explained
- Configuration details
- **Time: 45 minutes read**

### Option 3: Just Give Me the Commands!
👉 **Use:** [UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md)
- Copy-paste commands
- Quick checklist
- Essential commands
- **Time: 10 minutes**

### Option 4: Application Deployment
👉 **Follow:** [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)
- After system installation
- Backend setup
- Frontend deployment
- Testing & verification
- **Time: 30 minutes**

---

## 🔧 Installation Scripts

### Automated System Installation
```bash
sudo bash deployment/ubuntu-24-04-install.sh
```
**Installs:**
- PostgreSQL 16
- Node.js 18 LTS
- Nginx
- PM2
- Certbot
- Firewall (UFW)
- Application user

### Verify Installation
```bash
bash deployment/verify-installation.sh
```
**Checks:**
- All components installed
- Services running
- Database accessible
- All ports open
- Directory structure

---

## 📖 Documentation Quick Links

| Guide | Purpose | Read Time |
|-------|---------|-----------|
| [UBUNTU_24_04_MASTER_GUIDE.md](UBUNTU_24_04_MASTER_GUIDE.md) | Start here - overview | 20 min |
| [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md) | Detailed technical steps | 45 min |
| [UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md) | Commands only | 10 min |
| [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md) | Deploy the app | 30 min |
| [deployment/ubuntu-24-04-install.sh](deployment/ubuntu-24-04-install.sh) | Auto installer | - |
| [deployment/verify-installation.sh](deployment/verify-installation.sh) | Verification tool | - |

---

## ⚡ Phase Overview

### Phase 1: System Setup (5 min)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential python3
sudo ufw enable && sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
```

### Phase 2: Automated Installation (15 min)
```bash
sudo bash deployment/ubuntu-24-04-install.sh
```

### Phase 3: Verification (2 min)
```bash
bash deployment/verify-installation.sh
```

### Phase 4: Application Deployment (25 min)
```bash
# See UBUNTU_24_04_POST_DEPLOYMENT.md
# - Copy application files
# - Install dependencies
# - Configure .env
# - Run migrations
# - Build frontend
# - Start services
```

---

## ✅ What Gets Installed

| Component | Version | Purpose |
|-----------|---------|---------|
| Ubuntu | 24.04 LTS | Operating system |
| PostgreSQL | 16 | Database |
| Node.js | 18 LTS | Backend runtime |
| npm | Latest | Package manager |
| Nginx | Latest | Web server |
| PM2 | 5.x | Process manager |
| Certbot | Latest | SSL certificates |
| UFW | Built-in | Firewall |

---

## 🎯 Total Setup Time

- System Preparation: **5 min**
- Automated Installation: **15 min**
- Verification: **2 min**
- Application Deployment: **25 min**
- **TOTAL: ~50 minutes**

---

## 🐛 Having Issues?

### Installation Stuck?
→ Check: [UBUNTU_24_04_SETUP.md](UBUNTU_24_04_SETUP.md) → Troubleshooting

### Application Won't Start?
→ Check: [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md) → Troubleshooting

### General Problems?
→ Check: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📞 Support Resources

### View Installation Progress
```bash
# Run verification script
bash deployment/verify-installation.sh

# Check services
sudo systemctl status postgresql
sudo systemctl status nginx
pm2 status
```

### Check Logs
```bash
# Backend logs
pm2 logs tamil-calendar-backend

# Nginx errors
sudo tail -f /var/log/nginx/tamil-calendar-error.log

# System journal
journalctl -u postgresql -f
```

---

## 🚀 Quick Access After Setup

Once running:

```
Frontend:   http://your-server-ip
Admin:      http://your-server-ip/admin/login
API:        http://your-server-ip/api/public/today
Health:     http://your-server-ip/health
```

---

## 🎯 Start Here

**NEW TO THIS?** Read in this order:
1. [UBUNTU_24_04_MASTER_GUIDE.md](UBUNTU_24_04_MASTER_GUIDE.md) - Overview (20 min)
2. [UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md) - Commands (10 min)
3. Run installation script: `sudo bash deployment/ubuntu-24-04-install.sh`
4. Verify: `bash deployment/verify-installation.sh`
5. Deploy: Follow [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md)

**EXPERIENCED?** Jump to:
- [UBUNTU_24_04_QUICK_REFERENCE.md](UBUNTU_24_04_QUICK_REFERENCE.md) - Copy commands
- `sudo bash deployment/ubuntu-24-04-install.sh` - Run installer
- [UBUNTU_24_04_POST_DEPLOYMENT.md](UBUNTU_24_04_POST_DEPLOYMENT.md) - Deploy app

---

## 📊 System Requirements

- Ubuntu 24.04 LTS (fresh or minimal install)
- 2+ CPU cores
- 2+ GB RAM (4 GB recommended)
- 20+ GB disk space
- Internet connection
- SSH access

---

## ✨ Installation Verification Checklist

After each phase:

- [ ] Phase 1: System updated, firewall enabled
- [ ] Phase 2: Automated script completed successfully
- [ ] Phase 3: Verification script shows all ✓
- [ ] Phase 4: Application accessible

---

**Status:** ✅ Ready to Deploy  
**Last Updated:** April 18, 2026  

**START HERE:** [UBUNTU_24_04_MASTER_GUIDE.md](UBUNTU_24_04_MASTER_GUIDE.md) 🚀
