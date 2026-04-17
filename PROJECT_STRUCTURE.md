# 📦 Tamil Calendar - Complete Project Structure

## Project Overview
A production-ready Tamil Calendar & Panchangam web application with Node.js backend, React frontend, MongoDB database, and Telegram bot integration.

---

## 🏗️ Complete Directory Structure

```
tamil-calendar/
│
├── 📁 backend/                          # Node.js Express API Server
│   ├── 📁 models/                       # MongoDB Schema Definitions
│   │   ├── Calendar.js                  # Calendar data with Panchangam info
│   │   ├── Admin.js                     # User authentication & management
│   │   └── Log.js                       # Activity logging & audit trail
│   │
│   ├── 📁 routes/                       # API Route Handlers
│   │   ├── public.js                    # Public endpoints (no auth required)
│   │   └── admin.js                     # Admin endpoints (JWT protected)
│   │
│   ├── 📁 middleware/                   # Express Middleware
│   │   └── auth.js                      # JWT verification & permissions
│   │
│   ├── 📁 scrapers/                     # Web Scraper Modules
│   │   ├── drikPanchang.js              # Drik Panchang scraper
│   │   ├── proKerala.js                 # Pro Kerala scraper
│   │   └── dinamalar.js                 # Dinamalar scraper
│   │
│   ├── 📁 cron/                         # Scheduled Tasks
│   │   ├── dailyUpdate.js               # Daily calendar update (4:30 AM IST)
│   │   └── telegramBot.js               # Telegram bot & messages (5:00 AM IST)
│   │
│   ├── 📁 scripts/                      # Utility Scripts
│   │   ├── seedAdmin.js                 # Create initial admin user
│   │   └── dataManager.js               # Backup, restore, maintenance
│   │
│   ├── server.js                        # Main Express server
│   ├── config.js                        # Centralized configuration
│   ├── package.json                     # Backend dependencies
│   ├── .env.example                     # Environment template
│   └── .gitignore                       # Git ignore file
│
├── 📁 frontend/                         # React.js Web Application
│   ├── 📁 src/
│   │   ├── 📁 pages/                    # Page Components
│   │   │   ├── HomePage.jsx             # Home page with today's data
│   │   │   ├── CalendarPage.jsx         # Monthly calendar view
│   │   │   ├── FestivalsPage.jsx        # Festivals listing
│   │   │   ├── SearchPage.jsx           # Date/festival search
│   │   │   ├── NotFoundPage.jsx         # 404 page
│   │   │   │
│   │   │   └── 📁 admin/                # Admin Pages
│   │   │       ├── AdminLogin.jsx       # Login page
│   │   │       ├── AdminDashboard.jsx   # Admin dashboard
│   │   │       ├── AdminCalendarManager.jsx  # Calendar CRUD
│   │   │       ├── AdminLogs.jsx        # Activity logs viewer
│   │   │       └── AdminSettings.jsx    # Settings page
│   │   │
│   │   ├── 📁 components/               # Reusable Components
│   │   │   ├── Header.jsx               # Navigation header
│   │   │   └── Footer.jsx               # Page footer
│   │   │
│   │   ├── 📁 store/                    # Zustand State Management
│   │   │   ├── authStore.js             # Authentication state
│   │   │   └── calendarStore.js         # Calendar data state
│   │   │
│   │   ├── 📁 api/                      # API Client
│   │   │   └── client.js                # Axios client configuration
│   │   │
│   │   ├── App.jsx                      # Root component with routing
│   │   ├── index.js                     # React entry point
│   │   └── index.css                    # Global styles
│   │
│   ├── 📁 public/
│   │   └── index.html                   # HTML template
│   │
│   ├── package.json                     # Frontend dependencies
│   ├── tailwind.config.js               # Tailwind CSS config
│   └── .gitignore
│
├── 📁 nginx/                            # Nginx Web Server Config
│   └── tamil-calendar.conf              # Reverse proxy & static serving
│
├── 📁 pm2/                              # PM2 Process Manager Config
│   └── ecosystem.config.js              # Multi-process configuration
│
├── 📁 deployment/                       # Deployment Scripts
│   ├── install.sh                       # Ubuntu server setup
│   └── start-dev.sh                     # Development startup script
│
├── 📁 backups/                          # Database Backups (created at runtime)
│   └── backup_YYYYMMDD_HHmmss.json
│
├── 📄 README.md                         # Project overview & quick start
├── 📄 DEPLOYMENT.md                     # Detailed deployment guide
├── 📄 API.md                            # API endpoints documentation
├── 📄 TROUBLESHOOTING.md                # Troubleshooting & FAQ
├── 📄 QUICKREF.sh                       # Quick reference card
├── 📄 .gitignore                        # Global git ignore
└── 📄 LICENSE                           # MIT License

```

---

## 📊 Database Schema

### Calendar Collection
```javascript
{
  _id: ObjectId,
  date: Date,                            // UTC date
  dateString: String,                    // YYYY-MM-DD
  tamilDate: String,                     // "15 சித்திரை"
  tamilDateDetails: {
    day: Number,
    monthTamil: String,
    monthEnglish: String,
    year: Number,
    yearTamil: String
  },
  tithi: {
    name: String,
    nameTamil: String,
    startTime: String,
    endTime: String,
    lord: String,
    description: String
  },
  nakshatram: { ... },
  yoga: { ... },
  karana: { ... },
  sunrise: String,                       // HH:MM format
  sunset: String,
  moonrise: String,
  moonset: String,
  rahuKalam: { startTime, endTime, description },
  yamagandam: { startTime, endTime, description },
  kuligai: { startTime, endTime, description },
  abhijit: { startTime, endTime },
  festivals: [{
    name: String,
    nameTamil: String,
    type: String,                        // major, minor, regional, national
    description: String,
    significance: String,
    rituals: [String]
  }],
  moonPhase: {
    phase: String,                       // new, waxing, full, waning
    illumination: Number,                // 0-100
    age: Number                          // days
  },
  planets: {
    sun: String,
    moon: String,
    mars: String,
    mercury: String,
    jupiter: String,
    venus: String,
    saturn: String
  },
  manualOverride: {
    isOverridden: Boolean,
    overriddenBy: ObjectId,
    overrideReason: String,
    overriddenAt: Date,
    originalData: Mixed
  },
  dataQuality: {
    isVerified: Boolean,
    verifiedBy: ObjectId,
    verifiedAt: Date,
    confidence: Number,                  // 0-100
    hasError: Boolean,
    errorMessage: String,
    errorDetectedAt: Date
  },
  dataSource: {
    primary: String,                     // drikpanchang, prokerala, etc
    secondary: [String],
    scrapedAt: Date,
    scrapedBy: String,
    notes: String
  },
  metadata: {
    views: Number,
    lastAccessed: Date,
    language: String                     // en, ta
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,                         // unique
  password: String,                      // hashed with bcrypt
  role: String,                          // admin, moderator, viewer
  permissions: [String],                 // specific actions allowed
  lastLogin: Date,
  loginCount: Number,
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    userAgent: String,
    status: String                       // success, failed
  }],
  isActive: Boolean,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  changesCount: Number,
  lastChangeDate: Date,
  metadata: {
    department: String,
    phone: String,
    timezone: String,
    preferences: {
      theme: String,                    // light, dark
      notifications: {
        email: Boolean,
        push: Boolean,
        sms: Boolean
      },
      language: String                  // en, ta
    }
  },
  activeSessions: [{
    token: String,
    createdAt: Date,
    expiresAt: Date,
    ipAddress: String
  }],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Log Collection
```javascript
{
  _id: ObjectId,
  type: String,                          // scraper, calendar_update, error, etc
  message: String,
  details: Mixed,
  adminId: ObjectId,                     // ref: Admin
  calendarId: ObjectId,                  // ref: Calendar
  status: String,                        // success, pending, failed, warning
  changeData: {
    before: Mixed,
    after: Mixed,
    changedFields: [String]
  },
  request: {
    method: String,
    endpoint: String,
    ip: String,
    userAgent: String,
    statusCode: Number,
    responseTime: Number                 // ms
  },
  error: {
    message: String,
    stack: String,
    code: String,
    source: String
  },
  scraper: {
    name: String,
    source: String,
    itemsScraped: Number,
    itemsProcessed: Number,
    itemsErrors: Number,
    duration: Number
  },
  notification: {
    sent: Boolean,
    channel: String,
    recipient: String,
    sentAt: Date
  },
  severity: String,                      // info, warning, error, critical
  tags: [String],
  relatedLogs: [ObjectId],
  archived: Boolean,
  archivedAt: Date,
  createdAt: Date,
  updatedAt: Date
  // Expires after 90 days (TTL index)
}
```

---

## 🔗 API Routes Summary

### Public Routes
- `GET /api/public/today` - Today's Panchangam
- `GET /api/public/tomorrow` - Tomorrow's data
- `GET /api/public/date/:dateString` - Specific date
- `GET /api/public/month/:year/:month` - Month calendar
- `GET /api/public/festivals` - Festival dates
- `GET /api/public/amavasya` - New moon dates
- `GET /api/public/pournami` - Full moon dates
- `GET /api/public/search` - Search functionality
- `GET /api/public/range/:startDate/:endDate` - Date range

### Admin Routes
- `POST /api/admin/login` - Authentication
- `GET /api/admin/profile` - User profile
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/calendar` - List calendars
- `GET /api/admin/calendar/:dateString` - Get specific
- `PUT /api/admin/calendar/:dateString` - Update/override
- `POST /api/admin/calendar/:dateString/verify` - Verify
- `GET /api/admin/logs` - Activity logs
- `POST /api/admin/scraper/run` - Trigger scraper
- `POST /api/admin/logout` - Logout

---

## 🔄 Data Flow

```
User Request
    ↓
Nginx (Reverse Proxy, Load Balancing)
    ↓
Express Middleware (Auth, Logging, Validation)
    ↓
Route Handler
    ↓
┌─────────────────────────────┐
│ Database Query/Update       │
│ ↓                           │
│ MongoDB                     │
│ (with indexes)              │
│                             │
│ Caching Layer (Optional)    │
└─────────────────────────────┘
    ↓
Response Formatting
    ↓
Client (React App or API Consumer)
```

---

## 🔐 Security Layers

1. **Transport:** HTTPS/TLS with Let's Encrypt
2. **API:** JWT token-based authentication
3. **Password:** bcrypt hashing (10 rounds)
4. **Rate Limiting:** 100 reqs/15min for public, 5 for admin
5. **Input Validation:** Express-validator on all inputs
6. **Headers:** Helmet.js for security headers
7. **Database:** MongoDB connection string validation
8. **Session:** JWT with 7-day expiry
9. **Permissions:** Role-based access control
10. **Audit Trail:** Complete logging of all changes

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         User Browser / Client           │
└─────────────────────────────────────────┘
              ↓ HTTPS ↓
┌─────────────────────────────────────────┐
│           Nginx (Port 443)              │
│  - SSL/TLS Termination                  │
│  - Reverse Proxy                        │
│  - Static File Serving                  │
│  - Load Balancing                       │
│  - Rate Limiting                        │
└─────────────────────────────────────────┘
    ↓                              ↓
┌─────────────────────┐   ┌───────────────────┐
│ Node.js Server      │   │ Frontend Assets   │
│ (Port 5000)         │   │ (Static HTML/JS)  │
│ - Express API       │   │ (Nginx serves)    │
│ - JWT Validation    │   │                   │
│ - Business Logic    │   │                   │
│ - PM2 Cluster       │   │                   │
│  (Multi-process)    │   │                   │
└─────────────────────┘   └───────────────────┘
    ↓
┌─────────────────────────────────────────┐
│        MongoDB Database                 │
│  - Calendar data                        │
│  - Admin users                          │
│  - Activity logs                        │
│  - Indexed for performance              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│    Telegram Bot (External Service)      │
│  - Daily notifications                  │
│  - Command responses                    │
└─────────────────────────────────────────┘
```

---

## 📈 Performance Optimizations

1. **Database:**
   - Proper indexing on frequently queried fields
   - Connection pooling
   - Query optimization

2. **Frontend:**
   - Code splitting with React Router
   - Image optimization
   - CSS minification
   - Gzip compression

3. **Backend:**
   - PM2 cluster mode (multi-process)
   - Response caching
   - Database connection pooling
   - Request/response compression

4. **Server:**
   - Nginx caching
   - CDN for static assets (optional)
   - HTTP/2 support
   - Connection keepalive

---

## 🔄 Cron Job Schedule

```
Daily:
  04:30 AM IST - Calendar scraping & update
  05:00 AM IST - Data validation
  05:00 AM IST - Telegram bot daily message

Weekly:
  Sunday 02:00 AM - Log cleanup (90+ days)

Manual:
  Anytime - Admin can trigger scraper manually
```

---

## 📱 Frontend Routes

```
Public Routes:
  / - Home page
  /calendar - Monthly calendar
  /festivals - Festivals listing
  /search - Search page
  /404 - Not found

Admin Routes:
  /admin/login - Login page
  /admin/dashboard - Dashboard
  /admin/calendar - Calendar manager
  /admin/logs - Activity logs
  /admin/settings - Settings
```

---

## 🎯 Key Features Matrix

| Feature | Status | Type | Module |
|---------|--------|------|--------|
| Daily Panchangam | ✅ | Public | HomePage |
| Monthly Calendar | ✅ | Public | CalendarPage |
| Festival Listing | ✅ | Public | FestivalsPage |
| Date Search | ✅ | Public | SearchPage |
| Admin Dashboard | ✅ | Admin | AdminDashboard |
| Calendar Override | ✅ | Admin | AdminCalendarManager |
| Activity Logs | ✅ | Admin | AdminLogs |
| Telegram Bot | ✅ | Automation | telegramBot.js |
| Scraper Engine | ✅ | Backend | scrapers/ |
| Data Backup | ✅ | Utility | dataManager.js |
| JWT Auth | ✅ | Security | auth.js |
| Rate Limiting | ✅ | Security | server.js |
| Audit Trail | ✅ | Logging | Log model |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview & quick start |
| DEPLOYMENT.md | Step-by-step deployment |
| API.md | API endpoint documentation |
| TROUBLESHOOTING.md | Troubleshooting & FAQ |
| QUICKREF.sh | Command quick reference |
| PROJECT_STRUCTURE.md | This file |

---

## 🎓 Technology Stack Summary

**Backend:**
- Node.js 18 LTS
- Express.js
- MongoDB 6.0
- Mongoose
- Puppeteer
- Node-cron
- JWT/bcrypt

**Frontend:**
- React 18
- Tailwind CSS
- Zustand
- Axios
- React Router
- Lucide Icons

**Infrastructure:**
- Ubuntu 20.04/22.04
- Nginx
- PM2
- Let's Encrypt
- SystemD

---

**Last Updated:** January 2024
**Project Version:** 1.0.0
**Status:** Production Ready ✅
