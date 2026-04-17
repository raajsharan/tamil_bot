#!/bin/bash

# Development Setup Script
set -e

echo "=========================================="
echo "Tamil Calendar - Development Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
cp .env.example .env
echo -e "${GREEN}Backend setup complete!${NC}"
echo ""

echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd ../frontend
npm install
echo -e "${GREEN}Frontend setup complete!${NC}"
echo ""

echo -e "${GREEN}=========================================="
echo "Development setup completed!"
echo "=========================================="
echo ""
echo "To start development:"
echo "1. Terminal 1 - Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:5000"
echo ""
