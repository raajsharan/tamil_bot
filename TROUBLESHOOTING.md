# 🔧 Tamil Calendar - Troubleshooting & FAQ

## Quick Diagnostics

Run these commands to diagnose issues:

```bash
# Check system status
pm2 status

# View real-time logs
pm2 logs

# Check specific service
pm2 logs tamil-calendar-api

# Monitor CPU and memory
pm2 monit

# Check disk space
df -h

# Check MongoDB
systemctl status mongod

# Check Nginx
systemctl status nginx

# Check open ports
sudo netstat -tulpn | grep LISTEN
```

---

## 🚨 Common Issues & Solutions

### 1. Application Won't Start

**Symptom:** PM2 shows status as "errored" or "stopped"

**Solutions:**
```bash
# Check logs
pm2 logs tamil-calendar-api

# Clear PM2
pm2 kill
pm2 start pm2/ecosystem.config.js --env production

# Check Node.js version
node -v  # Should be 18+

# Check if port is in use
sudo lsof -i :5000

# Kill process on port
sudo kill -9 <PID>

# Check MongoDB connection
mongosh  # or mongo

# View Node process errors
pm2 start backend/server.js --no-daemon
```

**Error: "Address already in use"**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Error: "Cannot find module"**
```bash
cd backend
npm install
npm audit fix
```

---

### 2. MongoDB Connection Issues

**Symptom:** "MongoServerError: connect ECONNREFUSED 127.0.0.1:27017"

**Solutions:**
```bash
# Check MongoDB status
systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# MongoDB won't start - clean lock file
sudo systemctl stop mongod
sudo rm /var/lib/mongodb/mongod.lock
sudo systemctl start mongod

# Reset MongoDB (WARNING: loses data)
sudo systemctl stop mongod
sudo rm -rf /var/lib/mongodb/*
sudo systemctl start mongod

# Connect to MongoDB
mongosh
> db.adminCommand("ping")  # Should return { ok: 1 }
```

---

### 3. Nginx Not Working

**Symptom:** "502 Bad Gateway" or connection refused

**Solutions:**
```bash
# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Start/restart Nginx
sudo systemctl start nginx
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/tamil-calendar-error.log
sudo tail -f /var/log/nginx/tamil-calendar-access.log

# Check if Nginx is listening
sudo netstat -tulpn | grep nginx

# Fix permissions
sudo chown -R www-data:www-data /var/www/tamil-calendar

# Reload Nginx after config change
sudo nginx -s reload
```

**Error: "upstream timed out"**
```bash
# Backend is down - restart it
pm2 restart tamil-calendar-api

# Increase timeout in nginx.conf
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;

sudo systemctl reload nginx
```

---

### 4. SSL/HTTPS Issues

**Symptom:** "SSL certificate problem" or "ERR_SSL_PROTOCOL_ERROR"

**Solutions:**
```bash
# Check certificate
sudo openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -text -noout

# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Test renewal (dry-run)
sudo certbot renew --dry-run

# Fix Nginx SSL config
# In /etc/nginx/sites-available/tamil-calendar.conf:
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

sudo nginx -t
sudo systemctl reload nginx

# Test SSL
curl -v https://your-domain.com
```

**Certificate renewal fails:**
```bash
# Check Nginx is listening on port 80
sudo netstat -tulpn | grep :80

# Check firewall
sudo ufw status

# Ensure port 80 is open
sudo ufw allow 80/tcp

# Retry certification
sudo certbot certonly --nginx -d your-domain.com
```

---

### 5. High Memory/CPU Usage

**Symptom:** Server slow, high CPU or memory

**Solutions:**
```bash
# Monitor in real-time
pm2 monit

# Check which process uses memory
ps aux | sort -nrk 4 | head -10

# Check MongoDB memory
du -sh /var/lib/mongodb/

# Restart application
pm2 restart all

# Increase Node.js memory
pm2 start backend/server.js --max-memory-restart 1G

# Check disk space
df -h

# Clean old logs
sudo journalctl --vacuum=30d

# Check database
mongosh
> db.collection.aggregate([{$group:{_id:null,count:{$sum:1}}}])

# Clear old logs
node scripts/dataManager.js clean-logs 30

# Restart MongoDB
sudo systemctl restart mongod

# Kill zombie processes
pm2 kill
pm2 start pm2/ecosystem.config.js --env production
```

---

### 6. Scraper Not Working

**Symptom:** Calendar data not updating, scraper errors in logs

**Solutions:**
```bash
# Check scraper logs
pm2 logs tamil-calendar-api | grep -i scraper

# Run scraper manually
cd backend
node -e "
  require('dotenv').config();
  const { scrapeDrikPanchang } = require('./scrapers/drikPanchang');
  scrapeDrikPanchang().then(r => console.log(r));
"

# Check if websites are accessible
curl -I https://www.drikpanchang.com/tamil/tamil-calendar.html

# Test with timeout
curl -I --max-time 10 https://www.drikpanchang.com/tamil/tamil-calendar.html

# Check Puppeteer/Chromium
npx puppeteer browser-fetcher status

# Install Puppeteer dependencies
sudo apt-get install -y libnss3 libxss1 libasound2

# Manually trigger scraper
# Admin Panel -> Scraper Control -> Run

# Check logs after running
pm2 logs
```

---

### 7. Database Issues

**Symptom:** Slow queries, database corruption, data loss

**Solutions:**
```bash
# Check database status
mongosh
> show dbs
> use tamil-calendar
> show collections
> db.calendars.countDocuments()

# Repair database
sudo systemctl stop mongod
sudo mongod --repair --dbpath /var/lib/mongodb/
sudo systemctl start mongod

# Backup before repair
mongodump --db tamil-calendar --out /backup/before-repair/

# Check collection stats
db.calendars.stats()

# Rebuild indexes
db.calendars.reIndex()

# Remove duplicates
db.calendars.deleteMany({
  _id: {
    $in: db.calendars.aggregate([
      { $group: { _id: "$dateString", ids: { $push: "$_id" } } },
      { $match: { "ids.1": { $exists: true } } },
      { $project: { ids: { $slice: [1, -1] } } },
      { $unwind: "$ids" },
      { $replaceRoot: { newRoot: "$ids" } }
    ]).toArray()
  }
})

# Create index if missing
db.calendars.createIndex({ dateString: 1 })
db.calendars.createIndex({ date: 1 })
```

---

### 8. Admin Login Issues

**Symptom:** "Invalid credentials" or can't login

**Solutions:**
```bash
# Reset admin password
cd backend
npm run seed

# Check if admin exists
mongosh
> use tamil-calendar
> db.admins.find()

# Reset specific admin password
db.admins.updateOne(
  { email: "admin@tamil-calendar.local" },
  { $unset: { password: 1 } }
)

# Delete and recreate admin
db.admins.deleteOne({ email: "admin@tamil-calendar.local" })

# Exit MongoDB and run seed
npm run seed

# Check JWT configuration
echo $JWT_SECRET
```

---

### 9. Frontend Not Loading

**Symptom:** Blank page, "Cannot GET /" error

**Solutions:**
```bash
# Rebuild frontend
cd frontend
npm install
npm run build

# Check build output
ls -la build/

# Copy to Nginx
sudo cp -r build/* /var/www/tamil-calendar/

# Set permissions
sudo chown -R www-data:www-data /var/www/tamil-calendar

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Test frontend directly
curl http://localhost:3000/  # If running dev server

# Check for 404 errors
curl -v https://your-domain.com/
```

---

### 10. API Response Errors

**Symptom:** 500 errors, timeout, "Internal Server Error"

**Solutions:**
```bash
# Check backend logs
pm2 logs tamil-calendar-api

# Check detailed error
pm2 logs tamil-calendar-api --lines 100

# Test API health
curl https://your-domain.com/health

# Test specific endpoint
curl https://your-domain.com/api/public/today

# Check request timeout
curl --max-time 30 https://your-domain.com/api/public/today

# View detailed error in backend logs
grep "Error" /var/log/pm2/api-error.log

# Restart backend
pm2 restart tamil-calendar-api

# Check Node.js crash
pm2 status

# Increase max request time in Nginx
proxy_read_timeout 60s;
sudo systemctl reload nginx
```

---

## 📊 Performance Troubleshooting

### Slow API Response
```bash
# Check database performance
mongosh
> db.calendars.find({}).explain("executionStats")

# Check Nginx response time
sudo tail -f /var/log/nginx/tamil-calendar-access.log

# Check backend response time
pm2 logs | grep "responseTime"

# Optimize MongoDB query
db.calendars.createIndex({ dateString: 1 })
db.calendars.createIndex({ 'dataQuality.hasError': 1 })

# Restart MongoDB
sudo systemctl restart mongod
```

---

## ❓ FAQ

### Q: How do I change the database URL?
**A:** Edit `backend/.env` and update `MONGODB_URI`, then restart:
```bash
pm2 restart tamil-calendar-api
```

### Q: How do I reset the admin password?
**A:** Run the seed script again:
```bash
cd backend
npm run seed
```

### Q: How do I enable the Telegram bot?
**A:** Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID` to `.env`, then restart.

### Q: How do I backup the database?
**A:** 
```bash
cd backend
node scripts/dataManager.js backup
```

### Q: How do I restore from backup?
**A:**
```bash
node scripts/dataManager.js restore backups/backup_YYYYMMDD.json
```

### Q: Can I run without MongoDB Atlas?
**A:** Yes, install MongoDB locally and use `mongodb://localhost:27017/tamil-calendar`

### Q: How do I add more scrapers?
**A:** Create new scraper in `backend/scrapers/`, then add to daily cron job.

### Q: Can I disable the Telegram bot?
**A:** Don't set `TELEGRAM_BOT_TOKEN` in `.env`

### Q: How do I view live logs?
**A:** `pm2 logs -f` or `pm2 logs tamil-calendar-api --lines 100 --raw`

### Q: How do I export calendar data?
**A:** Admin Panel -> Calendar -> Export as CSV/JSON

---

## 📞 Getting Help

1. **Check logs first:**
   ```bash
   pm2 logs
   ```

2. **Check system status:**
   ```bash
   pm2 status
   systemctl status mongod
   systemctl status nginx
   ```

3. **Run diagnostics:**
   ```bash
   cd backend
   node scripts/dataManager.js verify
   ```

4. **Contact support:**
   - Email: support@tamil-calendar.com
   - GitHub Issues: Create issue with logs
   - Documentation: Review README.md and DEPLOYMENT.md

---

## 🔍 Debug Mode

Enable debug logging:
```bash
# In backend/.env
NODE_ENV=development
LOG_LEVEL=debug

# Restart
pm2 restart tamil-calendar-api

# Watch logs
pm2 logs --raw
```

---

**Last Updated:** January 2024
**Version:** 1.0.0
