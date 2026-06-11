# 🔗 MOBILE + WEB = SAME BACKEND API

## Architecture: One Backend, Multiple Frontends

```
┌─────────────────────────────────────────┐
│         BACKEND API                     │
│      (Node.js + Express)                │
│      Port: 5000                         │
│      Base: http://YOUR_IP:5000/api      │
│                                         │
│  Database: MongoDB (same for all!)      │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
    ┌─────────────────────────────────┐
    │ WEB APP (React)                 │
    │ Port: 5173                      │
    │ Connects to:                    │
    │ http://localhost:5000/api       │
    └─────────────────────────────────┘
    
    ┌─────────────────────────────────┐
    │ MOBILE APP (React Native)       │
    │ Port: 19006 (Expo web)          │
    │ Connects to:                    │
    │ http://YOUR_IP:5000/api         │
    └─────────────────────────────────┘
    
    ┌─────────────────────────────────┐
    │ CLI / Another Frontend          │
    │ Connects to:                    │
    │ http://YOUR_IP:5000/api         │
    └─────────────────────────────────┘
```

**KEY POINT:** Same database, same API endpoints, different user interfaces!

---

## ✅ IDENTICAL API ENDPOINTS

### Authentication (Same for both)
```javascript
// WEB APP (frontend/src/lib/api.js)
axios.post('/auth/login', { email, password })
axios.post('/auth/register', { name, email, password, role })

// MOBILE APP (mobile/src/screens/auth/LoginScreen_New.js)
axios.post('/auth/login', { email, password })
axios.post('/auth/register', { name, email, password, role })

// ✅ SAME ENDPOINT - Both work!
```

### Services (Same for both)
```javascript
// WEB APP
axios.get('/services')
axios.get('/services/:id')

// MOBILE APP
axios.get('/services')
axios.get('/services/:id')

// ✅ SAME ENDPOINT - Returns same 9 services!
```

### Bookings (Same for both)
```javascript
// WEB APP
axios.get('/bookings')                          // Admin sees all
axios.get('/bookings/mybookings')               // Customer sees own
axios.post('/bookings', { data })               // Create booking
axios.put('/bookings/:id/status', { status })   // Update status

// MOBILE APP
axios.get('/bookings')                          // Expert sees assigned
axios.get('/bookings/mybookings')               // Customer sees own
axios.post('/bookings', { data })               // Create booking
axios.put('/bookings/:id/employee-finished', {})// Mark finished

// ✅ SAME ENDPOINTS - Both access same database!
```

### Feedback (Same for both)
```javascript
// WEB APP
axios.post('/feedback', { rating, comment, bookingId })
axios.get('/feedback/employee/:employeeId')

// MOBILE APP
axios.post('/feedback', { rating, comment, bookingId })
axios.get('/feedback/employee/:employeeId')

// ✅ SAME ENDPOINTS - Both get same ratings!
```

---

## 🔐 Authentication (Same Token System)

### WEB APP Flow:
```javascript
1. User login at http://localhost:5173/login
2. Send credentials to POST /auth/login
3. Backend returns: { token: "jwt...", user: {...} }
4. Store token in localStorage
5. Add header: Authorization: Bearer token
6. All requests use this token
```

### MOBILE APP Flow:
```javascript
1. User login on mobile browser at http://localhost:19006
2. Send credentials to POST /auth/login
3. Backend returns: { token: "jwt...", user: {...} }
4. Store token in AsyncStorage
5. Add header: Authorization: Bearer token
6. All requests use this token
```

**✅ SAME JWT TOKENS - Both verified by same backend!**

---

## 💾 Database (Completely Shared)

### MongoDB Collections (Accessed by both)

```
Database: free-service
├── users
│   └─ Created by both web register and mobile register
│   └─ Login works on both with same credentials
│
├── services
│   └─ Displayed on web Services page
│   └─ Displayed on mobile HomeScreen
│   └─ Both see exact same 9 services
│
├── bookings
│   └─ Created from web booking form
│   └─ Visible on mobile MyBookings screen
│   └─ Expert sees same bookings on web dashboard and mobile
│
├── employees
│   └─ Created when application approved (admin dashboard or web)
│   └─ Assigned to jobs on mobile ExpertJobsScreen
│   └─ Tracked same way on web SystemAdmin
│
├── feedback
│   └─ Submitted from web feedback modal
│   └─ Visible on mobile after booking completes
│   └─ Both see same ratings
│
├── applications
│   └─ Applied from web Partner page
│   └─ Approved from mobile (if admin role)
│   └─ Both use same approval flow
```

**✅ SAME DATABASE - When web creates booking, mobile sees it instantly!**

---

## 📊 Example: One User, Two Platforms

### Scenario: Customer books on WEB, sees on MOBILE

**Step 1: Customer registers on WEB**
```
http://localhost:5173/register
↓
POST /auth/register { name: "John", email: "john@email.com", password: "pass", role: "customer" }
↓
MongoDB: users collection gets entry
↓
Returns token
↓
Stored in localStorage
```

**Step 2: Same customer logs in on MOBILE**
```
http://localhost:19006 (mobile)
↓
POST /auth/login { email: "john@email.com", password: "pass" }
↓
Backend checks MongoDB users collection ✓ Found!
↓
Returns same token
↓
Stored in AsyncStorage
```

**Step 3: Customer books service on WEB**
```
http://localhost:5173/services
↓
Clicks "Book" on Water Purifier
↓
POST /bookings { serviceId: "...", date: "...", amount: 500 }
↓
MongoDB: bookings collection gets entry
↓
Shows success
```

**Step 4: Customer opens MOBILE**
```
http://localhost:19006
↓
Clicks "Bookings" tab
↓
GET /bookings/mybookings
↓
Backend queries MongoDB: bookings collection
↓
Finds the booking from step 3! ✓
↓
Shows on mobile: "Water Purifier - ₹500 - Pending"
```

**✅ SAME DATA ON BOTH PLATFORMS!**

---

## 🔗 How They Connect

### WEB APP (frontend/src/lib/api.js)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Backend on same computer
  timeout: 10000,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Then in any React component:**
```javascript
// Fetch services
const response = await api.get('/services');
setServices(response.data);
```

### MOBILE APP (mobile/src/services/api.js)
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.YOUR_IP:5000/api';  // Backend IP
// For localhost: 'http://127.0.0.1:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Then in any React Native component:**
```javascript
// Fetch services
const response = await api.get('/services');
setServices(response.data);
```

**✅ SAME CODE PATTERN - Different storage (localStorage vs AsyncStorage)**

---

## 🚀 DATA FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────────┐
│ DEMONSTRATION: Book on WEB, See on MOBILE                   │
└──────────────────────────────────────────────────────────────┘

MOMENT 1: WEB APP
  User at http://localhost:5173
  ↓
  Clicks "Book Water Purifier"
  ↓
  POST /bookings {serviceId: "123", date: "2026-04-25", amount: 500}
  ↓
  BACKEND RECEIVES:
  - Verifies JWT token ✓
  - Validates data ✓
  - Inserts into MongoDB.bookings ✓
  - Returns: { success: true, bookingId: "abc123" }
  ↓
  MONGODB: bookings collection now has:
  {
    _id: "abc123",
    serviceId: "123",
    userId: "user123",
    date: "2026-04-25",
    amount: 500,
    status: "Pending",
    createdAt: "2026-04-21T10:00:00"
  }

MOMENT 2: MOBILE APP (few seconds later)
  User at http://localhost:19006
  ↓
  Clicks "📅 Bookings" tab
  ↓
  GET /bookings/mybookings
  ↓
  BACKEND RECEIVES:
  - Verifies JWT token ✓
  - Gets userId from token
  - Queries MongoDB: db.bookings.find({userId: "user123"})
  ↓
  MongoDB returns the booking from MOMENT 1! ✓
  ↓
  Returns to mobile:
  {
    _id: "abc123",
    service: { title: "Water Purifier", category: "Repairs", price: 500 },
    status: "Pending",
    date: "2026-04-25",
    amount: 500
  }
  ↓
  MOBILE DISPLAYS:
  📅 Booking #abc123
  🔧 Water Purifier
  💰 ₹500
  ⏱️  Pending
  📍 Your location

✅ SAME BOOKING VISIBLE ON BOTH PLATFORMS!
```

---

## 📋 ALL ENDPOINTS (Used by Both)

```
═══════════════════════════════════════════════════════════════
AUTHENTICATION
═══════════════════════════════════════════════════════════════
POST   /auth/login                 → Login (web + mobile)
POST   /auth/register              → Register (web + mobile)

═══════════════════════════════════════════════════════════════
SERVICES (Read-only for customers/experts)
═══════════════════════════════════════════════════════════════
GET    /services                   → Get all services (web + mobile)
GET    /services/:id               → Get service details (web + mobile)

═══════════════════════════════════════════════════════════════
BOOKINGS
═══════════════════════════════════════════════════════════════
POST   /bookings                   → Create booking (web + mobile)
GET    /bookings                   → Get all bookings (admin/expert on web + mobile)
GET    /bookings/mybookings        → Get my bookings (customer on web + mobile)
PUT    /bookings/:id/status        → Update status (admin on web)
PUT    /bookings/:id/employee-finished    → Mark finished (expert on web + mobile)
PUT    /bookings/:id/confirm-completion   → Confirm completion (customer on web + mobile)

═══════════════════════════════════════════════════════════════
FEEDBACK
═══════════════════════════════════════════════════════════════
POST   /feedback                   → Submit feedback (web + mobile)
GET    /feedback/booking/:id       → Get feedback (web + mobile)
GET    /feedback/employee/:id      → Get ratings (web + mobile)

═══════════════════════════════════════════════════════════════
EMPLOYEES
═══════════════════════════════════════════════════════════════
GET    /employees                  → Get employees (web admin)
PUT    /employees/:id              → Update employee (web admin)

═══════════════════════════════════════════════════════════════
APPLICATIONS
═══════════════════════════════════════════════════════════════
POST   /applications               → Apply as partner (web + mobile)
GET    /applications               → Get applications (web admin)
PUT    /applications/:id/approve   → Approve application (web admin)
PUT    /applications/:id/reject    → Reject application (web admin)

═══════════════════════════════════════════════════════════════
USERS
═══════════════════════════════════════════════════════════════
GET    /users/profile              → Get user profile (web + mobile)
PUT    /users/profile              → Update profile (web + mobile)

✅ ALL ENDPOINTS AVAILABLE TO BOTH WEB AND MOBILE!
```

---

## 🔄 Real-time Sync Example

### What happens when expert marks work finished

**MOBILE:** Expert at http://localhost:19006
```
Clicks "✓ Mark Work Finished" on job
↓
PUT /bookings/abc123/employee-finished
↓
Backend updates: booking.employeeFinished = NOW()
↓
Returns success
```

**WEB:** Customer refreshes dashboard at http://localhost:5173
```
Clicks "My Bookings"
↓
GET /bookings/mybookings
↓
Backend queries MongoDB
↓
Sees employeeFinished is set! ✓
↓
Shows: "✅ Expert has finished the work!"
↓
Shows feedback modal
```

**✅ INSTANT SYNC - Mobile updates, Web sees it immediately!**

---

## 🎯 What This Means for Your Exam

### Show the Examiner:

1. **Open WEB** (http://localhost:5173)
   - Login as customer
   - Browse services
   - **Book Water Purifier** ← Note the booking

2. **Open MOBILE** (http://localhost:19006)
   - Login with same account
   - Click "Bookings" tab
   - **See the booking you just created on web!**
   - Say: "Same database, same backend!"

3. **Continue on MOBILE**
   - Logout
   - Login as expert
   - Click "My Jobs" tab
   - **See the booking assigned to you**
   - Click "Mark Work Finished"

4. **Switch to WEB**
   - Refresh dashboard
   - **See notification: "Expert finished the work!"**
   - Say: "Real-time sync between platforms!"

5. **Back to MOBILE**
   - Click "Confirm Complete"
   - Fill feedback form
   - Submit rating

6. **Show WEB**
   - Booking shows rating and feedback
   - Say: "All data synchronized across platforms!"

---

## 💡 Why This Architecture is Professional

✅ **Scalability**: Add more frontends (Android app, CLI, TV app) - no backend changes!
✅ **Consistency**: All platforms see same data from one database
✅ **Maintenance**: Fix bug in backend = fixed everywhere
✅ **Cross-platform**: Users can switch devices and continue seamlessly
✅ **Real-time**: Changes on one platform instantly visible on others

---

## 📝 Checklist Before Exam

```
BACKEND SETUP:
✓ Running on port 5000
✓ Connected to MongoDB
✓ Services seeded (9 items)
✓ No console errors

WEB APP SETUP:
✓ Running on port 5173
✓ Can register and login
✓ Can browse services
✓ Can create booking
✓ Shows booking in dashboard

MOBILE APP SETUP:
✓ Running on port 19006
✓ Can register and login (same account as web if you use same email)
✓ Can browse services (same 9 items)
✓ Can see booking created on web
✓ Can mark work finished
✓ Can confirm completion

DATA SYNC TEST:
✓ Book on web → See on mobile ✓
✓ Mark finished on mobile → Notification on web ✓
✓ Submit feedback on mobile → Rating shows on web ✓

READY FOR EXAMINER? ✓✓✓
```

---

## 🚀 Start Right Now!

### Terminal 1 (Backend)
```powershell
cd "c:\Users\sanja\OneDrive\Desktop\Free Service\backend"
npm start
# Wait for: "Server running on port 5000"
```

### Terminal 2 (Web)
```powershell
cd "c:\Users\sanja\OneDrive\Desktop\Free Service\frontend"
npm run dev
# Wait for: "Local: http://localhost:5173"
```

### Terminal 3 (Mobile)
```powershell
cd "c:\Users\sanja\OneDrive\Desktop\Free Service\mobile"
npm start
# Press: w (for web)
# Opens: http://localhost:19006
```

**All three running = All three connected to same database! ✓**

---

## ✨ Final Summary

| Aspect | Web App | Mobile App | Backend |
|--------|---------|-----------|---------|
| Platform | React | React Native | Node.js/Express |
| Port | 5173 | 19006 (Expo) | 5000 |
| Database | MongoDB | MongoDB | MongoDB |
| API Endpoints | Same | Same | All endpoints |
| Authentication | JWT + localStorage | JWT + AsyncStorage | MongoDB users |
| User Data | Shared | Shared | Single source |
| Bookings | Shared | Shared | Single source |
| Feedback | Shared | Shared | Single source |

**✅ COMPLETELY SYNCHRONIZED - One backend, multiple frontends!**

**Go show your examiner! 🎉**
