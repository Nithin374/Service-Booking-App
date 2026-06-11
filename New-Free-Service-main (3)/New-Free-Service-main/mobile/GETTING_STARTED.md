# Expo Mobile App - Quick Start Guide

## Overview

This is the mobile application for the Free Service platform. It's built with React Native and Expo, making it easy to run on both iOS and Android devices.

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Backend URL
Edit `.env.local` and update with your machine IP:
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api
```

**Find your IP:**
- **Windows:** Open PowerShell, type `ipconfig`, find "IPv4 Address"
- **Mac/Linux:** Open terminal, type `ifconfig` or `hostname -I`

### 3. Start the App
```bash
npm start
```

### 4. Run on Device/Emulator
- **Android Emulator:** Press `a`
- **iOS Simulator:** Press `i`
- **Physical Device:** Scan QR code with Expo Go app

---

## 📱 App Walkthrough

### Authentication Flow
1. **Login Page** - Enter email and password
   - Test email: `user@example.com`
   - Test password: `password123`

2. **Register Page** - Create new account
   - Name, email, phone, password

3. **Main Navigation** - Bottom tab navigation
   - Home, Bookings, Partner, Profile

### Main Features

#### 🏠 Home Tab
- Welcome message
- Quick access to services
- Popular services list
- Links to bookings and partner program

#### 🏪 Browse Services
- See all available services
- Search by name or category
- Filter by service type
- Quick book button

#### 📅 Bookings
- View all your bookings
- Filter by status (Pending, Confirmed, Completed)
- Cancel pending bookings
- Refresh for latest updates

#### 🤝 Partner Program
- Learn about partnership benefits
- Submit application
- Track application status

#### 👤 Profile
- View and edit user information
- Logout button

#### 🛡️ Admin Dashboard
- View platform statistics
- Review partner applications
- Approve/reject applications

---

## 🔧 Configuration Files

### `.env.local`
```env
# Required: Your backend API URL
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api
```

### `app.json`
- App name, icon, splash screen
- Platform-specific settings (iOS bundle ID, Android package)
- Permissions configuration

---

## 🚀 Running on Physical Devices

### Prerequisites
- Expo Go app installed (iOS App Store or Google Play Store)
- Same network as your computer

### Steps
1. Run `npm start`
2. Scan QR code with Expo Go app
3. App loads on your device
4. Changes sync live when you save code

---

## 📦 Project Structure Explained

### Entry Point
- `index.js` - Registers React component
- `App.js` - Main navigation setup

### Authentication
- `src/context/AuthContext.js` - Login/logout logic
- `src/services/api.js` - API configuration with token handling

### API Services
- `src/services/index.js` - All API endpoints

### Screens (Pages)
```
src/screens/
├── auth/              # Login/Register
├── user/              # Home, Services, Bookings, Profile
├── partner/           # Partner program
└── admin/             # Admin dashboard
```

---

## 🔑 Test Accounts

### Regular User
```
Email: user@example.com
Password: password123
```

### Partner
```
Email: partner@example.com
Password: password123
Status: Check application status in Partner tab
```

### Admin
```
Email: admin@example.com
Password: password123
```

---

## 🐛 Troubleshooting

### Issue: App Won't Connect to Backend
**Solution:**
1. Verify backend is running: `npm run dev` (in backend folder)
2. Get your machine IP: `ipconfig` (Windows) or `ifconfig` (Mac)
3. Update `.env.local` with correct IP
4. Restart Expo: Press Ctrl+C then `npm start`

### Issue: "Cannot find module" Error
**Solution:**
```bash
rm -rf node_modules
npm install
npm start --clear
```

### Issue: Blank Screen After Scan QR
**Solution:**
1. Ensure Expo Go app is installed
2. Check both devices on same network
3. Try restarting Expo: Ctrl+C then `npm start`

### Issue: Changes Not Reflecting
**Solution:**
- Save file (Ctrl+S)
- Wait 2-3 seconds for auto-reload
- If stuck, press `r` in terminal to restart

---

## 📋 API Endpoints Your Backend Needs

The app expects these endpoints on your backend:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/services
GET    /api/services/:id
POST   /api/bookings
GET    /api/bookings
POST   /api/bookings/:id/cancel
POST   /api/applications
GET    /api/applications
POST   /api/applications/:id/approve
POST   /api/applications/:id/reject
GET    /api/users/profile
PUT    /api/users/profile
```

See backend README for more details on API structure.

---

## 💡 Tips for Development

### Hot Reload
- Just save your file, app updates automatically

### View Console Logs
```bash
# In terminal where Expo is running
# Press 'j' to open logs
```

### Debug on Device
1. Shake device
2. Tap "Show remote JS log monitor"
3. See console.log output in terminal

### Reset App State
- On device: Pull to refresh on home screen
- In code: Clear AsyncStorage for testing logout

---

## 📚 Additional Resources

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **React Navigation:** https://reactnavigation.org/

---

## ✅ Checklist Before Deployment

- [ ] Backend is running and accessible
- [ ] `.env.local` has correct API URL
- [ ] All screens are tested
- [ ] Bookings can be created and cancelled
- [ ] Partner application can be submitted
- [ ] Admin can approve/reject applications
- [ ] User profile can be edited
- [ ] Logout works correctly

---

## 🎯 Next Steps

After testing locally:
1. Build release APK for Android
2. Build IPA for iOS
3. Share with beta testers
4. Collect feedback and iterate

---

**Need help? Check README.md for detailed documentation.**
