#!/bin/bash

set -e

echo "=========================================="
echo "Tamil Calendar - Installation Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

echo -e "${BLUE}Step 1: Update System${NC}"
apt-get update
apt-get upgrade -y

echo -e "${BLUE}Step 2: Install Node.js 18 LTS${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

echo -e "${BLUE}Step 3: Install PostgreSQL${NC}"
apt-get install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'Password@1234';"
sudo -u postgres psql -c "ALTER ROLE postgres WITH SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE tamil_calendar OWNER postgres;"

echo -e "${BLUE}Step 4: Install Nginx${NC}"
apt-get install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

echo -e "${BLUE}Step 5: Install PM2${NC}"
npm install -g pm2
pm2 startup
pm2 save

echo -e "${BLUE}Step 6: Install Certbot (SSL/TLS)${NC}"
apt-get install -y certbot python3-certbot-nginx

echo -e "${BLUE}Step 7: Install Build Tools${NC}"
apt-get install -y build-essential git curl wget

echo -e "${BLUE}Step 8: Configure Firewall${NC}"
apt-get install -y ufw
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

echo -e "${GREEN}=========================================="
echo "Installation completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clone the repository:"
echo "   cd /home && git clone <your-repo> tamil-calendar"
echo ""
echo "2. Setup backend:"
echo "   cd tamil-calendar/backend"
echo "   npm install"
echo "   cp .env.example .env"
echo "   nano .env  (update configuration)"
echo "   npm run migrate"
echo "   npm run seed"
echo ""
echo "3. Setup frontend:"
echo "   cd ../frontend"
echo "   npm install"
echo "   npm run build"
echo ""
echo "4. Setup SSL certificate:"
echo "   sudo certbot certonly --standalone -d your-domain.com"
echo ""
echo "5. Copy Nginx config:"
echo "   sudo cp nginx/tamil-calendar.conf /etc/nginx/sites-available/"
echo "   sudo ln -s /etc/nginx/sites-available/tamil-calendar.conf /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "6. Start application with PM2:"
echo "   cd /home/tamil-calendar"
echo "   pm2 start pm2/ecosystem.config.js --env production"
echo ""
