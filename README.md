# 📅 Tamil Calendar & Panchangam - Production Application

A complete, production-ready Tamil Calendar and Panchangam web application with a fully functional admin panel, scraper engine, Telegram bot, and self-healing data system.

## 🌟 Features

### Public Website
- 📆 **Daily Panchangam**: Today's complete astrological data
- 🗓️ **Monthly Calendar**: Full month view with all dates
- 🎉 **Festivals**: Important Tamil festivals and celebrations
- 🌙 **Moon Phases**: Amavasya (new moon) and Pournami (full moon) dates
- 🔍 **Search**: Find any date with detailed information
- 🇹🇦 **Tamil + English**: Full multilingual support
- 📱 **Mobile Responsive**: Works perfectly on all devices

### Admin Panel
- 🎛️ **Dashboard**: System stats, recent activity, quick actions
- 📊 **Calendar Manager**: Edit/override calendar data
- 🤖 **Scraper Control**: Trigger manual scrapes
- 📋 **Audit Logs**: Complete activity tracking
- 🔐 **User Management**: Admin authentication with JWT
- ⚡ **Real-time**: Live status updates and alerts

### Backend Features
- ✅ **Data Validation**: Automatic error detection
- 🔄 **Self-Healing**: Automatic retry with fallback
- 📡 **Multi-Source Scraping**: Drik Panchang, ProKerala, and more
- 🚀 **Cron Jobs**: Automatic daily updates at 4:30 AM IST
- 💾 **MongoDB**: Fully indexed for performance
- 🔐 **Security**: JWT, bcrypt, rate limiting, HTTPS

### Telegram Bot
- 📱 **Daily Updates**: Auto-post at 5:00 AM IST
- `/today` - Today's Panchangam
- `/tomorrow` - Tomorrow's data
- `/amavasya` - New moon dates
- `/pournami` - Full moon dates

## 🏗️ Architecture

```
tamil-calendar/
├── backend/                    # Node.js Express API
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── middleware/             # Auth, logging
│   ├── scrapers/               # Web scraping modules
│   ├── cron/                   # Scheduled jobs
│   └── server.js               # Main server
├── frontend/                   # React.js UI
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── store/              # Zustand state
│   │   └── App.jsx             # Main app
├── nginx/                      # Nginx config
├── pm2/                        # PM2 config
├── deployment/                 # Installation script
└── README.md                   # This file
```

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Ubuntu 20.04 or 22.04 LTS
- Root or sudo access
- Domain name (for SSL)

### 1. Clone Repository
```bash
cd /home
git clone https://github.com/yourusername/tamil-calendar.git tamil-calendar
cd tamil-calendar
```

### 2. Run Installation Script
```bash
chmod +x deployment/install.sh
sudo bash deployment/install.sh
```

**⏱️ This takes ~10-15 minutes**

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
nano .env                    # Edit configuration

# Create admin user (interactive)
npm run seed
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install
npm run build
```

### 5. Configure Nginx
```bash
sudo cp nginx/tamil-calendar.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tamil-calendar.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL (Let's Encrypt)
```bash
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

### 7. Start Application
```bash
cd /home/tamil-calendar
pm2 start pm2/ecosystem.config.js --env production
pm2 save
sudo systemctl restart pm2-tamil-calendar
```

### 8. Verify
```bash
# Check status
pm2 status

# View logs
pm2 logs tamil-calendar-api

# Test API
curl https://your-domain.com/api/public/today
```

## 📦 Environment Configuration

Create `/home/tamil-calendar/backend/.env`:

```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/tamil-calendar

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=https://your-domain.com

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-token
TELEGRAM_CHANNEL_ID=-1001234567890

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/tamil-calendar/app.log

# Timezone
TIMEZONE=Asia/Kolkata
```

## 🔐 Admin Access

1. Navigate to `https://your-domain.com/admin`
2. Login with credentials created during `npm run seed`
3. Access dashboard at `/admin/dashboard`

### Admin Features
- **Dashboard**: View system stats and recent activity
- **Calendar Manager**: Edit or override calendar data
- **Logs**: View all system activities and errors
- **Settings**: Manage preferences

## 📊 API Endpoints

### Public API (No Authentication)
```
GET  /api/public/today              # Today's Panchangam
GET  /api/public/tomorrow           # Tomorrow's data
GET  /api/public/date/:dateString   # Specific date (YYYY-MM-DD)
GET  /api/public/month/:year/:month # Month calendar
GET  /api/public/festivals          # Festival dates
GET  /api/public/amavasya           # New moon dates
GET  /api/public/pournami           # Full moon dates
GET  /api/public/search?q=query     # Search
GET  /api/public/range/:start/:end  # Date range
```

### Admin API (Requires JWT)
```
POST /api/admin/login               # Login
GET  /api/admin/profile             # User profile
GET  /api/admin/dashboard           # Dashboard stats
GET  /api/admin/calendar            # List calendar
GET  /api/admin/calendar/:date      # Get specific date
PUT  /api/admin/calendar/:date      # Update/override
GET  /api/admin/logs                # Activity logs
POST /api/admin/logout              # Logout
```

## 🧹 Maintenance

### Database Backup
```bash
mongodump --db tamil-calendar --out /backup/mongodb/
```

### Update Application
```bash
cd /home/tamil-calendar
git pull origin main
npm install
npm run build
pm2 restart all
```

### View Logs
```bash
pm2 logs tamil-calendar-api        # Backend logs
pm2 logs tamil-calendar-web        # Frontend logs
sudo tail -f /var/log/nginx/tamil-calendar-error.log
```

### Restart Services
```bash
pm2 restart all
sudo systemctl restart nginx
```

## 🔄 Cron Jobs

### Daily Update (4:30 AM IST)
Automatically scrapes calendar data and updates database

### Validation (5:00 AM IST)
Validates scraped data and flags errors

### Cleanup (Sunday 2 AM)
Deletes logs older than 90 days

## 🐛 Troubleshooting

### MongoDB Won't Start
```bash
sudo systemctl stop mongod
sudo rm /var/lib/mongodb/mongod.lock
sudo systemctl start mongod
```

### Port Already in Use
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
pm2 restart all
```

### High Memory Usage
```bash
pm2 monit
pm2 kill
pm2 start pm2/ecosystem.config.js --env production
```

### Nginx Not Working
```bash
sudo nginx -t                  # Test config
sudo systemctl status nginx
sudo systemctl restart nginx
```

### Check System Resources
```bash
htop                          # CPU and memory
df -h                         # Disk space
netstat -tulpn | grep 5000   # Check port
```

## 📱 Telegram Bot Setup

### 1. Create Bot
- Open Telegram
- Search @BotFather
- Send `/newbot`
- Follow prompts
- Copy the token

### 2. Create Channel
- Create a public channel
- Add bot as admin
- Get channel ID (starts with -100)

### 3. Update .env
```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHANNEL_ID=-1001234567890
```

### 4. Test
```bash
curl -X POST https://api.telegram.org/botYOUR_TOKEN/sendMessage \
  -d chat_id=-100YOUR_CHANNEL \
  -d text="Test message"
```

## 🔐 Security Best Practices

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Enable MongoDB authentication
- [ ] Setup UFW firewall
- [ ] Enable SSL/TLS with Let's Encrypt
- [ ] Disable root login
- [ ] Setup SSH keys only
- [ ] Enable automatic updates
- [ ] Regular backups
- [ ] Monitor logs

## 📈 Performance Tips

1. **Enable Caching**: Already configured in Nginx
2. **Database Indexes**: Already configured
3. **Gzip Compression**: Already enabled
4. **PM2 Cluster**: Running in cluster mode
5. **MongoDB Optimization**: Proper indexing

## 📚 Technology Stack

### Backend
- Node.js 18 LTS
- Express.js
- MongoDB 6.0
- Mongoose ORM
- Puppeteer/Cheerio (Scraping)
- Node-cron (Scheduling)
- JWT Authentication

### Frontend
- React.js 18
- Tailwind CSS
- Zustand (State)
- Axios (HTTP)
- React Router
- Lucide Icons

### Infrastructure
- Ubuntu 20.04/22.04 LTS
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- MongoDB (Database)
- Let's Encrypt (SSL)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Support

- 📧 Email: support@tamil-calendar.com
- 🐙 GitHub Issues: [Create Issue](https://github.com/yourusername/tamil-calendar/issues)
- 📖 Documentation: [Full Docs](https://docs.tamil-calendar.com)

## 🕉️ Acknowledgments

- Data sources: Drik Panchang, Pro Kerala, Golden Chennai, Dinamalar
- Tamil community for inspiration
- Open source contributors

---

**Made with ❤️ for Tamil culture**

🌟 If you find this useful, please star the repository!

**Last Updated**: January 2024
**Version**: 1.0.0
