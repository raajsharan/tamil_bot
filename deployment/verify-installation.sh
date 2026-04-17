#!/bin/bash

# ============================================================================
# Tamil Calendar - Post-Installation Verification Script
# ============================================================================
# This script verifies that all components are installed correctly
# Run as: bash verify-installation.sh
# ============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 installed"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 NOT found"
        ((FAILED++))
        return 1
    fi
}

check_service() {
    if sudo systemctl is-active --quiet "$1"; then
        echo -e "${GREEN}✓${NC} $1 is running"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT running"
        ((FAILED++))
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} File exists: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} File missing: $1"
        ((FAILED++))
        return 1
    fi
}

check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directory exists: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Directory missing: $1"
        ((FAILED++))
        return 1
    fi
}

check_port() {
    if sudo netstat -tlnp 2>/dev/null | grep -q ":$1"; then
        echo -e "${GREEN}✓${NC} Port $1 is listening"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Port $1 is not listening (may not be started yet)"
        ((WARNINGS++))
        return 1
    fi
}

check_db_connection() {
    if sudo -u postgres psql -d tamil_calendar -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✓${NC} PostgreSQL connection successful"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} PostgreSQL connection failed"
        ((FAILED++))
        return 1
    fi
}

# ============================================================================
# Main Verification
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Tamil Calendar - Installation Verification Script      ║"
echo "║                                                            ║"
echo "║  Checking system dependencies and configurations           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# Section 1: Basic Commands
# ============================================================================
echo -e "${BLUE}[1/7] Checking Basic Commands...${NC}"
check_command "curl"
check_command "wget"
check_command "git"
check_command "nano"
check_command "vim"
echo ""

# ============================================================================
# Section 2: Database
# ============================================================================
echo -e "${BLUE}[2/7] Checking PostgreSQL...${NC}"
check_command "psql"
check_service "postgresql"
check_file "/etc/postgresql/16/main/postgresql.conf"
check_db_connection
echo ""

# ============================================================================
# Section 3: Node.js & npm
# ============================================================================
echo -e "${BLUE}[3/7] Checking Node.js & npm...${NC}"
check_command "node"
check_command "npm"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "  Node version: ${BLUE}$NODE_VERSION${NC}"
fi
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "  npm version: ${BLUE}$NPM_VERSION${NC}"
fi
echo ""

# ============================================================================
# Section 4: Web Server
# ============================================================================
echo -e "${BLUE}[4/7] Checking Nginx...${NC}"
check_command "nginx"
check_service "nginx"
check_port "80"
check_file "/etc/nginx/nginx.conf"
echo ""

# ============================================================================
# Section 5: Process Manager
# ============================================================================
echo -e "${BLUE}[5/7] Checking PM2...${NC}"
check_command "pm2"
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    echo -e "  PM2 version: ${BLUE}$PM2_VERSION${NC}"
fi
echo ""

# ============================================================================
# Section 6: SSL/TLS
# ============================================================================
echo -e "${BLUE}[6/7] Checking SSL/TLS Tools...${NC}"
check_command "certbot"
check_command "openssl"
echo ""

# ============================================================================
# Section 7: Application Directories
# ============================================================================
echo -e "${BLUE}[7/7] Checking Application Setup...${NC}"
check_directory "/home/tamil-calendar"
check_directory "/home/tamil-calendar/app"
check_directory "/home/tamil-calendar/frontend/dist"
check_directory "/home/tamil-calendar/.pm2"

if id "tamil-calendar" &>/dev/null; then
    echo -e "${GREEN}✓${NC} Application user 'tamil-calendar' exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Application user 'tamil-calendar' does not exist"
    ((FAILED++))
fi
echo ""

# ============================================================================
# Application Files (if deployed)
# ============================================================================
if [ -d "/home/tamil-calendar/app/backend" ]; then
    echo -e "${BLUE}[Extra] Checking Backend Deployment...${NC}"
    check_directory "/home/tamil-calendar/app/backend"
    check_directory "/home/tamil-calendar/app/backend/logs"
    check_file "/home/tamil-calendar/app/backend/.env"
    check_file "/home/tamil-calendar/app/backend/package.json"
    check_file "/home/tamil-calendar/app/backend/server.js"
    echo ""
fi

if [ -d "/home/tamil-calendar/app/frontend" ]; then
    echo -e "${BLUE}[Extra] Checking Frontend Deployment...${NC}"
    check_directory "/home/tamil-calendar/app/frontend"
    check_directory "/home/tamil-calendar/app/frontend/dist"
    check_file "/home/tamil-calendar/app/frontend/package.json"
    echo ""
fi

if [ -f "/home/tamil-calendar/app/ecosystem.config.js" ]; then
    echo -e "${BLUE}[Extra] Checking PM2 Configuration...${NC}"
    check_file "/home/tamil-calendar/app/ecosystem.config.js"
    check_port "5000"
    echo ""
fi

# ============================================================================
# Firewall Status
# ============================================================================
echo -e "${BLUE}[Extra] Checking Firewall...${NC}"
if sudo ufw status | grep -q "Status: active"; then
    echo -e "${GREEN}✓${NC} UFW Firewall is active"
    ((PASSED++))
    echo -e "${BLUE}Firewall rules:${NC}"
    sudo ufw status | grep "ALLOW"
else
    echo -e "${YELLOW}⚠${NC} UFW Firewall is not active"
    ((WARNINGS++))
fi
echo ""

# ============================================================================
# Storage Space
# ============================================================================
echo -e "${BLUE}[Extra] Checking Storage...${NC}"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}')
echo -e "  Root partition usage: ${BLUE}$DISK_USAGE${NC}"

FREE_SPACE=$(df -h / | awk 'NR==2 {print $4}')
echo -e "  Free space: ${BLUE}$FREE_SPACE${NC}"

if [ $(df / | awk 'NR==2 {print $5}' | sed 's/%//') -lt 80 ]; then
    echo -e "${GREEN}✓${NC} Sufficient disk space available"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Low disk space"
    ((WARNINGS++))
fi
echo ""

# ============================================================================
# Memory Status
# ============================================================================
echo -e "${BLUE}[Extra] Checking Memory...${NC}"
TOTAL_MEM=$(free -h | awk 'NR==2 {print $2}')
USED_MEM=$(free -h | awk 'NR==2 {print $3}')
FREE_MEM=$(free -h | awk 'NR==2 {print $4}')

echo -e "  Total: ${BLUE}$TOTAL_MEM${NC}"
echo -e "  Used: ${BLUE}$USED_MEM${NC}"
echo -e "  Free: ${BLUE}$FREE_MEM${NC}"
echo ""

# ============================================================================
# System Information
# ============================================================================
echo -e "${BLUE}[System Information]${NC}"
echo -e "  OS: ${BLUE}$(lsb_release -d | cut -f2)${NC}"
echo -e "  Kernel: ${BLUE}$(uname -r)${NC}"
echo -e "  Hostname: ${BLUE}$(hostname)${NC}"
echo -e "  Uptime: ${BLUE}$(uptime -p)${NC}"
echo ""

# ============================================================================
# Summary
# ============================================================================
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION SUMMARY                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "  ${GREEN}✓ Passed: $PASSED${NC}"
echo -e "  ${YELLOW}⚠ Warnings: $WARNINGS${NC}"
echo -e "  ${RED}✗ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}          ✓ ALL CHECKS PASSED SUCCESSFULLY!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Your system is ready for Tamil Calendar deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Copy application files to /home/tamil-calendar/app/"
    echo "2. Configure backend .env file"
    echo "3. Run database migrations: npm run migrate"
    echo "4. Build frontend: cd frontend && npm run build"
    echo "5. Start backend: pm2 start ecosystem.config.js"
    echo "6. Configure Nginx site"
    echo ""
    exit 0
else
    echo -e "${RED}════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}          ✗ SOME CHECKS FAILED!${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Please review the failures above and run the installation script:"
    echo "  sudo bash deployment/ubuntu-24-04-install.sh"
    echo ""
    exit 1
fi
