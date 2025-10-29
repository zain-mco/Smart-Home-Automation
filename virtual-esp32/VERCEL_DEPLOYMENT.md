# 🚀 Deploying Virtual ESP32 to Vercel

## ⚠️ Important Changes

The original `virtual-device.js` was designed as a **long-running Node.js process** with WebSocket servers and Firebase listeners. Vercel uses a **serverless architecture** that doesn't support persistent connections.

### What Changed:
- ✅ Converted to **serverless API routes** (`/api/*`)
- ✅ Firebase operations via **REST API endpoints**
- ✅ Environment variable support for credentials
- ❌ Removed WebSocket server (not supported on Vercel)
- ❌ Removed automatic sensor updates (use API calls instead)

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Firebase Service Account Key** - From Firebase Console

---

## 🔧 Step 1: Prepare Firebase Credentials

### Get Your Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `smart-home-automation-641fc`
3. Click ⚙️ → **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file

### Copy the Entire JSON Content

Open `serviceAccountKey.json` and copy **ALL** content. It looks like:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

---

## 🌐 Step 2: Deploy to Vercel

### A. Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository: `Smart-Home-Automation`
4. Set **Root Directory** to: `virtual-esp32`
5. Click **Continue**

### B. Configure Environment Variables

Before deploying, add these environment variables:

1. Click **Environment Variables** section
2. Add the following variable:

**Variable Name:**
```
FIREBASE_SERVICE_ACCOUNT
```

**Value:**
```
Paste the ENTIRE content of serviceAccountKey.json here
```

**Important:** 
- Include the opening `{` and closing `}`
- Keep all the quotes and commas
- Vercel will handle it correctly even with newlines

3. **Optional:** Add database URL (if different):

**Variable Name:**
```
FIREBASE_DATABASE_URL
```

**Value:**
```
https://smart-home-automation-641fc-default-rtdb.firebaseio.com
```

### C. Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://your-project.vercel.app`

---

## ✅ Step 3: Test Your Deployment

### Visit Your Deployment

Open: `https://your-project.vercel.app`

You should see the API documentation page with test buttons.

### Initialize Firebase

1. Click **Test Initialize** button
2. You should see a success response with device and sensor data

### Test Device Control

1. Click **Turn Lamp ON**
2. Check your Firebase Realtime Database - the lamp1 status should change to "on"

### Test Sensors

1. Click **Test Update Sensors**
2. Random temperature and humidity values will be generated and saved to Firebase

---

## 🔗 Step 4: Integrate with Your Dashboard

Update your dashboard to use the API endpoints instead of WebSocket:

```javascript
// In your React dashboard
const API_BASE = 'https://your-project.vercel.app/api';

// Initialize on app start
async function initializeSystem() {
  const response = await fetch(`${API_BASE}/initialize`, { 
    method: 'POST' 
  });
  const data = await response.json();
  console.log('Initialized:', data);
}

// Get devices
async function getDevices() {
  const response = await fetch(`${API_BASE}/devices`);
  const data = await response.json();
  return data.devices;
}

// Update device
async function updateDevice(deviceId, status) {
  const response = await fetch(`${API_BASE}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, status })
  });
  return response.json();
}

// Get sensors
async function getSensors() {
  const response = await fetch(`${API_BASE}/sensors`);
  const data = await response.json();
  return data.sensors;
}

// Update sensors (simulate new readings)
async function updateSensors() {
  const response = await fetch(`${API_BASE}/sensors`, { 
    method: 'POST' 
  });
  return response.json();
}
```

---

## 🔄 Step 5: Redeploy After Changes

### Push Changes to GitHub

```bash
git add .
git commit -m "Update virtual-esp32 API"
git push
```

Vercel will **automatically redeploy** when you push to your main branch.

### Manual Redeploy

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Deployments**
4. Click **Redeploy** on the latest deployment

---

## 📊 Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/initialize` | Initialize Firebase with default data |
| GET | `/api/devices` | Get all device statuses |
| POST | `/api/devices` | Update device status |
| GET | `/api/sensors` | Get sensor readings |
| POST | `/api/sensors` | Generate new sensor readings |

---

## 🐛 Troubleshooting

### "Firebase credentials missing" Error

**Solution:** Make sure you added `FIREBASE_SERVICE_ACCOUNT` environment variable in Vercel settings.

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check that the variable is added
3. Redeploy the project

### API Returns 500 Error

**Solution:** Check Vercel logs for detailed error messages.

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to **Functions** tab to see error logs

### CORS Errors

**Solution:** The API already includes CORS headers. Make sure you're calling from HTTPS.

---

## 💡 Tips

- **Automatic Sensor Updates:** Use a cron job service (like Vercel Cron or external service) to call `/api/sensors` every 10 seconds
- **Real-time Updates:** Use Firebase's real-time listeners in your dashboard to receive instant updates
- **Monitor Usage:** Check Vercel dashboard for API usage and function invocations

---

## 📁 File Structure

```
virtual-esp32/
├── api/
│   ├── firebase-config.js    # Shared Firebase initialization
│   ├── initialize.js          # POST /api/initialize
│   ├── devices.js             # GET/POST /api/devices
│   └── sensors.js             # GET/POST /api/sensors
├── public/
│   └── index.html             # API documentation page
├── vercel.json                # Vercel configuration
├── package.json               # Dependencies
└── virtual-device.js          # Original (for local development)
```

---

## 🎯 Next Steps

1. ✅ Deploy to Vercel following steps above
2. ✅ Test all API endpoints
3. ✅ Update your dashboard to use the API
4. ✅ Set up automated sensor updates (optional)
5. ✅ Monitor logs and usage in Vercel dashboard

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or Firebase documentation.


# خطوات رفع المشروع على Vercel 🚀

## الخطوات المطلوبة منك:

### 1️⃣ تحضير بيانات Firebase

افتح ملف `serviceAccountKey.json` وانسخ **كل** محتوياته (من `{` للـ `}`)

---

### 2️⃣ رفع التعديلات على GitHub

```bash
git add .
git commit -m "Add Vercel API deployment"
git push
```

---

### 3️⃣ ربط المشروع بـ Vercel

1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اختر **Import Git Repository**
3. اختر الريبو: `Smart-Home-Automation`
4. في **Root Directory** حط: `virtual-esp32`
5. اضغط **Continue**

---

### 4️⃣ إضافة Environment Variables (مهم جداً!)

قبل ما تضغط Deploy:

1. اضغط على **Environment Variables**
2. أضف متغير جديد:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** الصق كل محتوى ملف `serviceAccountKey.json`
   - اضغط **Add**

3. (اختياري) أضف متغير تاني:
   - **Name:** `FIREBASE_DATABASE_URL`
   - **Value:** `https://smart-home-automation-641fc-default-rtdb.firebaseio.com`
   - اضغط **Add**

---

### 5️⃣ Deploy

اضغط **Deploy** وانتظر 2-3 دقايق

---

## ✅ بعد ما ينجح الرفع:

### تجربة الـ API:

1. افتح الرابط اللي هيعطيك ياه Vercel
2. هتلاقي صفحة فيها أزرار للتجربة
3. اضغط **Test Initialize** - لازم يشتغل ويرجع success
4. جرب باقي الأزرار

### ربط الـ Dashboard بالـ API:

في الـ React dashboard، استخدم الـ API بدل الـ WebSocket:

```javascript
const API_BASE = 'https://your-project.vercel.app/api';

// Initialize
await fetch(`${API_BASE}/initialize`, { method: 'POST' });

// Get devices
const response = await fetch(`${API_BASE}/devices`);
const data = await response.json();

// Update device
await fetch(`${API_BASE}/devices`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ deviceId: 'lamp1', status: 'on' })
});
```

---

## 🔍 لو حصلت مشكلة:

### Error: Firebase credentials missing

**الحل:** تأكد إنك حطيت `FIREBASE_SERVICE_ACCOUNT` في Environment Variables

1. اذهب لـ Vercel Dashboard
2. Settings → Environment Variables
3. تأكد إن المتغير موجود
4. Redeploy المشروع

---

## 📊 الـ API Endpoints المتاحة:

| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/api/initialize` | تهيئة Firebase بالبيانات الأولية |
| GET | `/api/devices` | جلب حالة جميع الأجهزة |
| POST | `/api/devices` | تحديث حالة جهاز معين |
| GET | `/api/sensors` | جلب قراءات الحساسات |
| POST | `/api/sensors` | توليد قراءات جديدة للحساسات |

---

## ملاحظات مهمة:

- ✅ الـ WebSocket تم إزالته (مش مدعوم على Vercel)
- ✅ التحديثات التلقائية للحساسات تم إزالتها (استخدم API calls بدلاً منها)
- ✅ يمكنك استخدام Firebase Realtime Listeners في الـ Dashboard للتحديثات الفورية
- ✅ الملف الأصلي `virtual-device.js` لسه موجود للتطوير المحلي

---

للتفاصيل الكاملة، اقرأ: `VERCEL_DEPLOYMENT.md`
