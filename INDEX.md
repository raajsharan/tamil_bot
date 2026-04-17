# 📍 Tamil Calendar Project - Complete Navigation Guide

## 🎯 Start Here

**First time?** → [GETTING_STARTED.md](GETTING_STARTED.md)  
**Want a summary?** → Run `bash SUMMARY.sh`  
**Need quick reference?** → Run `bash QUICKREF.sh`  

---

## 📚 Documentation Map

### Quick Guides
| Document | Purpose | Time |
|----------|---------|------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Setup & quick start | 5 min |
| [FILES_GUIDE.md](FILES_GUIDE.md) | File structure & navigation | 10 min |
| [QUICKREF.sh](QUICKREF.sh) | Quick commands & reference | 2 min |
| [SUMMARY.sh](SUMMARY.sh) | Project completion summary | 3 min |

### Detailed Guides
| Document | Purpose | Time |
|----------|---------|------|
| [IMPLEMENTATION.md](IMPLEMENTATION.md) | Complete technical documentation | 30 min |
| [API.md](API.md) | API endpoints reference | 15 min |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide | 20 min |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues & solutions | 10 min |

### Original Documentation
| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Architecture overview |
| [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md) | What was built |

---

## 🚀 Getting Started (Choose One)

### Option A: Local Development (Recommended for Testing)
```bash
# Terminal 1: Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Access: http://localhost:3000
```

### Option B: Docker (Recommended for Quick Setup)
```bash
docker-compose up -d
# Access: http://localhost:3000
```

### Option C: Production (Ubuntu/Debian Server)
```bash
sudo bash deployment/install.sh
# Follow the detailed steps in DEPLOYMENT.md
```

---

## 📂 Directory Structure

```
├── backend/              ← Node.js + Express API
│   ├── models/          ← Database schemas
│   ├── routes/          ← API endpoints
│   ├── middleware/      ← Auth, logging, rate limit
│   ├── scrapers/        ← Web data scrapers
│   ├── cron/            ← Background jobs
│   ├── scripts/         ← Utilities
│   ├── server.js        ← Main app
│   └── .env             ← Configuration
│
├── frontend/             ← React + Tailwind
│   ├── src/
│   │   ├── pages/       ← Application pages
│   │   ├── components/  ← React components
│   │   ├── store/       ← Zustand state
│   │   └── App.jsx      ← Main component
│   └── public/          ← Static assets
│
├── nginx/                ← Web server config
├── pm2/                  ← Process manager config
├── deployment/           ← Setup scripts
├── docker-compose.yml    ← Container setup
└── Documentation/        ← Guides & references
```

---

## 💡 Key Files to Know

### Backend Entry Point
- **[backend/server.js](backend/server.js)** - Main server with all middleware

### API Routes
- **[backend/routes/public.js](backend/routes/public.js)** - 9 public endpoints
- **[backend/routes/admin.js](backend/routes/admin.js)** - 10 protected endpoints

### Database
- **[backend/models/Calendar.js](backend/models/Calendar.js)** - Panchangam data
- **[backend/models/Admin.js](backend/models/Admin.js)** - User accounts
- **[backend/models/Log.js](backend/models/Log.js)** - Activity logging

### Frontend
- **[frontend/src/App.jsx](frontend/src/App.jsx)** - Main router
- **[frontend/src/pages/HomePage.jsx](frontend/src/pages/HomePage.jsx)** - Home page
- **[frontend/src/pages/admin/AdminDashboardPage.jsx](frontend/src/pages/admin/AdminDashboardPage.jsx)** - Admin dashboard

---

## 🔑 Important Commands

### Backend Setup
```bash
cd backend
npm install              # Install dependencies
npm run migrate         # Create database tables
npm run seed            # Create admin user
npm run dev             # Start with auto-reload
npm run backup          # Backup database
```

### Frontend Setup
```bash
cd frontend
npm install             # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
```

### Production (PM2)
```bash
pm2 start pm2/ecosystem.config.js
pm2 status              # Check status
pm2 logs                # View logs
pm2 monit               # Monitor resources
pm2 restart all         # Restart processes
```

### Docker
```bash
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
docker-compose restart  # Restart services
```

---

## 🌐 Access Points

### Local Development
- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login
- **API:** http://localhost:5000/api

### Production
- **Frontend:** https://your-domain.com
- **Admin:** https://your-domain.com/admin/login
- **API:** https://your-domain.com/api

---

## 📱 API Examples

### Get Today's Panchangam
```bash
curl http://localhost:5000/api/public/today
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@tamil-calendar.local",
    "password":"your-password"
  }'
```

### Get Monthly Calendar
```bash
curl http://localhost:5000/api/public/month/2024/4
```

### Get Festivals
```bash
curl http://localhost:5000/api/public/festivals
```

See [API.md](API.md) for complete API reference.

---

## 💾 Database

### Credentials
- Host: `localhost`
- Port: `5432`
- Database: `tamil_calendar`
- Username: `postgres`
- Password: `Password@1234`

### Tables
- **Calendar** - Panchangam data (25+ fields)
- **Admin** - User accounts with permissions
- **Log** - Complete audit trail

---

## 🔐 Security

✅ JWT authentication with 7-day expiry  
✅ bcrypt password hashing  
✅ Rate limiting on all endpoints  
✅ CORS protection  
✅ SQL injection prevention  
✅ XSS protection  
✅ Account lockout after 5 failed attempts  
✅ HTTPS/SSL support  

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Files | 53 |
| Lines of Code | 4000+ |
| Backend Files | 18 |
| Frontend Files | 15 |
| Configuration Files | 12 |
| Documentation Files | 8 |
| API Endpoints | 19 |
| Database Models | 3 |
| React Components | 15 |
| Scraper Modules | 3 |

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js 18+, Express.js |
| Frontend | React 18, Vite, Tailwind CSS |
| Database | PostgreSQL 15+, Sequelize ORM |
| Bot | Telegraf (Telegram Bot API) |
| Auth | JWT, bcryptjs |
| Deployment | Docker, Nginx, PM2 |
| Scraping | Puppeteer, Cheerio, Axios |

---

## 🎓 Learning Path

### Beginner
1. Read [GETTING_STARTED.md](GETTING_STARTED.md)
2. Setup local development (Option A)
3. Explore frontend pages
4. Check admin dashboard

### Intermediate
1. Read [API.md](API.md)
2. Study backend routes
3. Understand database models
4. Try API calls with curl

### Advanced
1. Read [IMPLEMENTATION.md](IMPLEMENTATION.md)
2. Study auth middleware
3. Configure Telegram bot
4. Setup production deployment

---

## 🆘 Need Help?

### Setup Issues?
→ Check [GETTING_STARTED.md](GETTING_STARTED.md)  
→ Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### API Questions?
→ Check [API.md](API.md)  
→ Read [backend/routes/public.js](backend/routes/public.js)

### Deployment Help?
→ Check [DEPLOYMENT.md](DEPLOYMENT.md)  
→ Read [deployment/install.sh](deployment/install.sh)

### General Troubleshooting?
→ Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)  
→ Run `bash QUICKREF.sh`

---

## ✅ Implementation Checklist

- [x] Backend setup (Express, PostgreSQL, Sequelize)
- [x] Frontend setup (React, Tailwind, Vite)
- [x] Database models (Calendar, Admin, Log)
- [x] API endpoints (19 total)
- [x] Authentication (JWT + bcrypt)
- [x] Web scrapers (3 modules)
- [x] Telegram bot (5 commands)
- [x] Cron jobs (daily updates)
- [x] Admin dashboard
- [x] Error handling
- [x] Logging system
- [x] Docker setup
- [x] Nginx config
- [x] PM2 config
- [x] Deployment scripts
- [x] Documentation (8 guides)

---

## 📞 Contact & Support

- **Documentation:** See guides above
- **GitHub Issues:** Report bugs there
- **Email:** support@tamil-calendar.local

---

## 🎉 You're All Set!

Your complete Tamil Calendar & Panchagam application is ready!

**Next Steps:**
1. Read [GETTING_STARTED.md](GETTING_STARTED.md)
2. Follow the setup instructions
3. Start developing!

**வாழ்க தமிழ்! 🇹🇦**

---

**Navigation Updated:** April 18, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
