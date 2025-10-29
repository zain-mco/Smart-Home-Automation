#!/bin/bash

# Smart Home Automation Setup Script
# This script automates the initial setup process

echo "======================================"
echo "Smart Home Automation Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dashboard dependencies
echo "📦 Installing dashboard dependencies..."
cd dashboard

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in dashboard directory"
    exit 1
fi

npm install

if [ $? -eq 0 ]; then
    echo "✅ Dashboard dependencies installed successfully"
else
    echo "❌ Failed to install dashboard dependencies"
    exit 1
fi

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Configure Firebase in dashboard/src/config/firebase.js"
echo "2. Run 'npm run dev' in the dashboard directory"
echo "3. Upload ESP32 firmware from esp32-firmware/smart-home.ino"
echo ""
echo "For detailed instructions, see SETUP_GUIDE.md"
echo ""
