@echo off
REM Smart Home Automation Setup Script for Windows
REM This script automates the initial setup process

echo ======================================
echo Smart Home Automation Setup
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo         Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [OK] npm version:
npm --version
echo.

REM Install dashboard dependencies
echo Installing dashboard dependencies...
cd dashboard

if not exist "package.json" (
    echo [ERROR] package.json not found in dashboard directory
    pause
    exit /b 1
)

call npm install

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dashboard dependencies installed successfully
) else (
    echo [ERROR] Failed to install dashboard dependencies
    pause
    exit /b 1
)

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Configure Firebase in dashboard\src\config\firebase.js
echo 2. Run 'npm run dev' in the dashboard directory
echo 3. Upload ESP32 firmware from esp32-firmware\smart-home.ino
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo.
pause
