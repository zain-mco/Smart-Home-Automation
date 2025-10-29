# Smart Home Dashboard

Modern React.js dashboard for controlling IoT devices in real-time.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Firebase Setup

1. Copy `.env.example` to `.env`
2. Get your Firebase config from [Firebase Console](https://console.firebase.google.com)
3. Update environment variables in `.env`

Alternatively, update `src/config/firebase.js` directly:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.jsx
│   │   ├── DeviceCard.jsx
│   │   ├── SensorPanel.jsx
│   │   ├── StatusBar.jsx
│   │   └── Login.jsx
│   ├── config/          # Configuration files
│   │   └── firebase.js
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuthState.js
│   │   └── useRealtimeData.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── tailwind.config.js  # Tailwind CSS config
```

## 🎨 Features

- **Real-time Updates**: Firebase Realtime Database integration
- **Device Control**: Toggle devices on/off instantly
- **Sensor Monitoring**: Live temperature, humidity, and other sensor data
- **Authentication**: Secure login with Firebase Auth
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Built with TailwindCSS and Lucide icons

## 🔐 Authentication

Default demo credentials:
- Email: `demo@smarthome.com`
- Password: `demo123`

To add more users, use Firebase Console → Authentication → Add User

## 📊 Firebase Database Structure

```json
{
  "devices": {
    "lamp1": {
      "name": "Living Room Lamp",
      "status": "on"
    },
    "fan1": {
      "name": "Bedroom Fan",
      "status": "off"
    }
  },
  "sensors": {
    "temperature": 26.5,
    "humidity": 45,
    "lastUpdate": 1635789600000
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Manual Deployment

```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint code with ESLint

### Environment Variables

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🧩 Adding New Devices

1. Add device to Firebase Realtime Database:
```json
{
  "devices": {
    "newdevice1": {
      "name": "My New Device",
      "status": "off"
    }
  }
}
```

2. Dashboard will automatically detect and display it!

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      }
    }
  }
}
```

### Modify Device Icons

Edit `src/components/DeviceCard.jsx`:

```javascript
const deviceIcons = {
  lamp: Lightbulb,
  fan: Wind,
  yourdevice: YourIcon
};
```

## 🐛 Troubleshooting

### Firebase Connection Error
- Verify Firebase config is correct
- Check database rules allow read/write
- Ensure database is in correct region

### Can't Log In
- Verify user exists in Firebase Authentication
- Check credentials are correct
- Clear browser cache and cookies

### Devices Not Updating
- Check Firebase Realtime Database rules
- Verify ESP32 is connected and sending data
- Check browser console for errors

## 📝 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
