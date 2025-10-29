@echo off
echo.
echo ╔════════════════════════════════════════╗
echo ║   Virtual ESP32 Device Simulator     ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Check if serviceAccountKey.json exists
if not exist "serviceAccountKey.json" (
    echo.
    echo ❌ ERROR: serviceAccountKey.json not found!
    echo.
    echo 📋 Please follow these steps:
    echo    1. Go to Firebase Console
    echo    2. Project Settings → Service Accounts
    echo    3. Generate New Private Key
    echo    4. Save as: serviceAccountKey.json
    echo    5. Place in this directory
    echo.
    pause
    exit /b 1
)

echo ✅ Starting virtual device...
echo.
node virtual-device.js
