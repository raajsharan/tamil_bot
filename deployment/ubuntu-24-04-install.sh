#!/bin/bash

# ============================================================================
# Tamil Calendar - Ubuntu 24.04 Automated Installation Script
# ============================================================================
# This script automates the installation of all system dependencies
# Run as: sudo bash ubuntu-24-04-install.sh
# ============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    log_error "This script must be run as root (use: sudo bash ubuntu-24-04-install.sh)"
fi

# Check Ubuntu version
if ! grep -q "Ubuntu 24.04" /etc/os-release; then
    log_warning "This script is optimized for Ubuntu 24.04. Your system may be different."
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Tamil Calendar - Ubuntu 24.04 Installation Script        ║"
echo "║                                                            ║"
echo "║   Components to install:                                   ║"
echo "║   • System packages                                        ║"
echo "║   • PostgreSQL 16                                          ║"
echo "║   • Node.js 18 LTS                                         ║"
echo "║   • Nginx                                                  ║"
echo "║   • PM2 (Process Manager)                                  ║"
echo "║   • Certbot (SSL/TLS)                                      ║"
echo "║   • UFW Firewall                                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

read -p "Do you want to continue? (yes/no): " -r REPLY
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_error "Installation cancelled"
fi

# ============================================================================
# Step 1: System Update
# ============================================================================
log_info "Step 1/8: Updating system packages..."
apt update
apt upgrade -y
apt autoremove -y
log_success "System updated"

# ============================================================================
# Step 2: Install Essential Tools
# ============================================================================
log_info "Step 2/8: Installing essential tools..."
apt install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    python3-pip \
    htop \
    nano \
    vim \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    net-tools \
    iotop \
    nethogs \
    jq

log_success "Essential tools installed"

# ============================================================================
# Step 3: Configure Firewall (UFW)
# ============================================================================
log_info "Step 3/8: Configuring UFW firewall..."

ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
# Optional: ufw allow 5432/tcp  # PostgreSQL

log_success "Firewall configured"
ufw status

# ============================================================================
# Step 4: Install PostgreSQL 16
# ============================================================================
log_info "Step 4/8: Installing PostgreSQL 16..."

# Add PostgreSQL repository
sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt update

# Install PostgreSQL
apt install -y postgresql-16 postgresql-contrib-16

log_success "PostgreSQL 16 installed"

# Enable on startup
systemctl enable postgresql
systemctl start postgresql

# ============================================================================
# Step 5: Configure PostgreSQL Database
# ============================================================================
log_info "Step 5/8: Configuring PostgreSQL database..."

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE tamil_calendar;
CREATE USER postgres WITH PASSWORD 'Password@1234';
ALTER USER postgres WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE tamil_calendar TO postgres;
\c tamil_calendar
GRANT ALL ON SCHEMA public TO postgres;
EOF

log_success "PostgreSQL database configured"

# Test connection
if sudo -u postgres psql -d tamil_calendar -c "SELECT version();" &> /dev/null; then
    log_success "Database connection verified"
else
    log_error "Database connection failed"
fi

# ============================================================================
# Step 6: Install Node.js 18 LTS
# ============================================================================
log_info "Step 6/8: Installing Node.js 18 LTS..."

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js
apt install -y nodejs

log_success "Node.js installed"
node --version
npm --version

# Update npm
npm install -g npm@latest

# ============================================================================
# Step 7: Install Nginx
# ============================================================================
log_info "Step 7/8: Installing Nginx..."

apt install -y nginx

log_success "Nginx installed"

# Enable on startup
systemctl enable nginx
systemctl start nginx

# ============================================================================
# Step 8: Install PM2 and Certbot
# ============================================================================
log_info "Step 8/8: Installing PM2 and Certbot..."

# Install PM2 globally
npm install -g pm2

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

log_success "PM2 and Certbot installed"

# ============================================================================
# Post-Installation Setup
# ============================================================================
echo ""
log_success "════════════════════════════════════════════════════════"
log_success "ALL SYSTEM DEPENDENCIES INSTALLED SUCCESSFULLY!"
log_success "════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# Create Application User
# ============================================================================
log_info "Creating application user..."

if id "tamil-calendar" &>/dev/null; then
    log_warning "User 'tamil-calendar' already exists"
else
    useradd -m -s /bin/bash tamil-calendar
    log_success "User 'tamil-calendar' created"
fi

# Create directories
mkdir -p /home/tamil-calendar/app
mkdir -p /home/tamil-calendar/frontend/dist
mkdir -p /home/tamil-calendar/.pm2/logs
chown -R tamil-calendar:tamil-calendar /home/tamil-calendar

log_success "Application directories created"

# ============================================================================
# Verification
# ============================================================================
echo ""
log_info "Verifying installations..."

echo -n "PostgreSQL: "
psql --version

echo -n "Node.js: "
node --version

echo -n "NPM: "
npm --version

echo -n "Nginx: "
nginx -v

echo -n "PM2: "
pm2 --version

echo -n "Certbot: "
certbot --version

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          INSTALLATION SUMMARY & NEXT STEPS                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "✅ System Dependencies Installed:"
echo "   • PostgreSQL 16 running on localhost:5432"
echo "   • Database: tamil_calendar"
echo "   • User: postgres / Password: Password@1234"
echo "   • Node.js 18 LTS"
echo "   • Nginx web server"
echo "   • PM2 process manager"
echo "   • Certbot SSL/TLS"
echo "   • UFW firewall"
echo ""

echo "📋 Service Status:"
echo "   • PostgreSQL: $(systemctl is-active postgresql)"
echo "   • Nginx: $(systemctl is-active nginx)"
echo ""

echo "📁 Application Directories:"
echo "   • User: tamil-calendar"
echo "   • Home: /home/tamil-calendar"
echo "   • App: /home/tamil-calendar/app"
echo "   • Frontend: /home/tamil-calendar/frontend/dist"
echo ""

echo "🚀 Next Steps:"
echo "   1. Copy your application files to /home/tamil-calendar/app/"
echo "   2. cd /home/tamil-calendar/app/backend"
echo "   3. npm install --production"
echo "   4. Create .env file with database credentials"
echo "   5. npm run migrate"
echo "   6. npm run seed (create admin user)"
echo "   7. cd ../frontend && npm install --production"
echo "   8. npm run build"
echo "   9. Configure Nginx site configuration"
echo "   10. Start backend with PM2"
echo ""

echo "📖 Documentation:"
echo "   • Full guide: UBUNTU_24_04_SETUP.md"
echo "   • Nginx config: /etc/nginx/sites-available/tamil-calendar"
echo "   • PM2 config: /home/tamil-calendar/app/ecosystem.config.js"
echo ""

echo "🔧 Useful Commands:"
echo "   • Check PostgreSQL: sudo systemctl status postgresql"
echo "   • Check Nginx: sudo systemctl status nginx"
echo "   • Monitor PM2: pm2 monit"
echo "   • View PM2 logs: pm2 logs"
echo "   • Restart Nginx: sudo systemctl reload nginx"
echo ""

echo "════════════════════════════════════════════════════════════"
log_success "Installation completed successfully!"
log_success "════════════════════════════════════════════════════════"
echo ""

# Reset to root
su - root
