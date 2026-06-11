# Free Service Mobile App - React Native with Expo

A complete mobile application for booking premium home services. Built with React Native and Expo for seamless iOS and Android deployment.

## Features

✅ **User Management**
- User registration and login with JWT authentication
- User profile management
- Role-based access (Customer, Partner, Admin)
- Secure token-based authentication

✅ **Service Browsing**
- Browse all available services
- Search and filter services by category
- Service details and pricing
- Service ratings

✅ **Booking System**
- Book services with date and time selection
- Real-time booking status tracking
- Cancel bookings
- View booking history
- Service address input with notes

✅ **Partner Program**
- Apply to become a service partner
- Submit partner application with experience details
- Track application status
- Receive notifications on approval/rejection

✅ **Admin Dashboard**
- View all partner applications
- Approve/reject applications
- View platform statistics
- Manage bookings and users

## Tech Stack

- **Frontend:** React Native, Expo
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **API:** Axios
- **Navigation:** React Navigation
- **UI Icons:** Lucide React Native
- **Date & Time:** @react-native-community/datetimepicker
- **Storage:** AsyncStorage

## Project Structure

```
mobile/
├── App.js                          # Main app entry with navigation setup
├── index.js                        # Expo entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── .env.local                      # Environment variables (configure this)
├── .gitignore                      # Git ignore rules
├── src/
│   ├── context/
│   │   └── AuthContext.js         # Authentication context
│   ├── services/
│   │   ├── api.js                 # Axios instance with interceptors
│   │   └── index.js               # API service methods
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.js     # User login
│       │   └── RegisterScreen.js  # User registration
│       ├── user/
│       │   ├── HomeScreen.js      # Home page with popular services
│       │   ├── ServicesScreen.js  # Browse all services
│       │   ├── ServiceDetailScreen.js  # Service details
│       │   ├── BookingScreen.js   # Create booking
│       │   ├── BookingsScreen.js  # View bookings
│       │   └── ProfileScreen.js   # User profile
│       ├── partner/
│       │   ├── PartnerScreen.js   # Partner info page
│       │   └── PartnerApplicationScreen.js  # Partner application form
│       └── admin/
│           └── DashboardScreen.js # Admin dashboard
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Backend server running on your network

### Step 1: Clone and Install Dependencies

```bash
cd mobile
npm install
```

### Step 2: Configure Environment Variables

Edit `.env.local` file:

```env
# Set your backend API URL (replace with your server IP)
EXPO_PUBLIC_API_BASE_URL=http://YOUR_MACHINE_IP:5000/api
```

**Important:** Find your machine IP:
- **Windows:** Run `ipconfig` in PowerShell, look for "IPv4 Address"
- **macOS/Linux:** Run `ifconfig` or `hostname -I`

Example:
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api
```

### Step 3: Start the Application

**Option A: Start Expo Development Server**
```bash
npm start
```

Then:
- Press **i** for iOS simulator
- Press **a** for Android emulator
- Scan QR code with Expo Go app (available on App Store/Play Store)

**Option B: Run on Android**
```bash
npm run android
```

**Option C: Run on iOS**
```bash
npm run ios
```

## Usage Guide

### 1. User Registration
- Open the app
- Click "Register here" on login screen
- Fill in name, email, phone, and password
- Account created successfully!

### 2. Browse & Book Services
- Home screen displays popular services
- Tap "See all" or use Services tab to browse all services
- Search by service name or category
- Tap a service to view details
- Click "Book This Service" to proceed
- Select date, time, and address
- Confirm booking

### 3. Manage Bookings
- View all your bookings in "Bookings" tab
- Filter by status (Pending, Confirmed, Completed, Cancelled)
- Cancel pending bookings
- Pull to refresh for latest status

### 4. Become a Partner
- Go to "Partner" tab
- Click "Apply Now"
- Fill in service category, experience, and bio
- Submit application
- Check status in Partner section
- Once approved, you can provide services!

### 5. Admin Functions (Admin Only)
- Access Dashboard automatically if admin user
- View all statistics (users, bookings, applications)
- Review pending partner applications
- Approve or reject applications
- Monitor platform activity

## API Integration

All API calls are handled through `/src/services/index.js`. The API client includes:

- **Automatic token injection** for authenticated requests
- **Error handling** with 401 redirect on token expiry
- **Request timeout** set to 10 seconds
- **Response interceptors** for consistent error handling

### Available Services:

```javascript
// Auth
authService.login(email, password)
authService.register(userData)
authService.logout()

// Services
serviceService.getAll(filters)
serviceService.getById(id)
serviceService.search(query)

// Bookings
bookingService.create(bookingData)
bookingService.getAll()
bookingService.cancel(id)

// Partner Applications
applicationService.create(appData)
applicationService.getAll()
applicationService.approve(id)
applicationService.reject(id)

// User Profile
userService.getProfile()
userService.updateProfile(data)
```

## Backend API Requirements

The mobile app expects the following backend endpoints:

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/search?q=query` - Search services

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings/:id/cancel` - Cancel booking

### Applications (Partner)
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get all applications
- `POST /api/applications/:id/approve` - Approve application
- `POST /api/applications/:id/reject` - Reject application

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Troubleshooting

### App Won't Connect to Backend
1. Verify backend is running: `npm run dev` in backend folder
2. Check backend port (default 5000)
3. Update `.env.local` with correct IP address
4. Ensure both devices are on same network
5. Check firewall settings

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset Expo cache
expo start --clear
```

### Permissions Issues (Android/iOS)
- App automatically requests required permissions for:
  - Camera (for photos)
  - Location (if needed)
  - Photo library (for images)
- Grant permissions when prompted during first use

### Date Picker Not Working
- Ensure `@react-native-community/datetimepicker` is installed
- For Android, native date/time picker is used
- For iOS, spinner picker is shown

## Environment Variables

All sensitive data should be stored in `.env.local`:

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_APP_NAME=Free Service
```

**Note:** Variables must start with `EXPO_PUBLIC_` to be accessible in Expo

## Production Deployment

### For iOS:
```bash
eas build --platform ios
```

### For Android:
```bash
eas build --platform android
```

## Features Coming Soon

- Push notifications
- Video call support
- In-app payment integration
- Service reviews and ratings
- Provider map view
- Real-time chat support

## Support & Troubleshooting

For issues and help:
1. Check the README.md in backend folder
2. Review backend logs
3. Verify network connectivity
4. Check environment variables

## License

All rights reserved. © 2026 Free Service

## Developer Notes

- All screens support both portrait and landscape
- Bottom-tab navigation for main user sections
- Stack navigation for nested screens
- Full TypeScript support available (convert when needed)
- Responsive design works on all device sizes

---

**Happy coding! 🚀**
