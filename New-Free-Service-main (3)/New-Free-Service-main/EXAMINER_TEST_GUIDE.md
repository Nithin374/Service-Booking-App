# 🎯 EXAMINER TEST GUIDE - Free Service Application

## ✅ Quick Start
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Servers Status:** ✓ Both running automatically

---

## 🧪 TEST SCENARIOS

### 1️⃣ HOME PAGE & NAVIGATION
**Path:** `/` (Home Page)
- ✓ Click "Book a Service" button → Routes to `/services`
- ✓ Click "Get a Job Now" button → Routes to `/partner`
- ✓ Navbar shows all navigation links
- ✓ Mobile menu toggle works

---

### 2️⃣ SEARCH FUNCTIONALITY ⭐ (NEW FEATURE ADDED)

#### **Services Page Search**
**Path:** `/services`
- ✓ **New Search Bar Added** - Search input field at top
- Type in search box (e.g., "Plumbing", "Beauty", "AC")
- Click **Search** button
- Results filter in real-time
- Shows "Search Results for [query]"
- Clear search shows all services

**Test Cases:**
```
✓ Search "Plumbing" → Shows only Plumbing services
✓ Search "Beauty" → Shows only Beauty services
✓ Search "AC" → Shows Air Conditioner services
✓ Empty search → Shows all 9 services
✓ Invalid search → Shows "No services found"
```

#### **Dashboard Search**
**Path:** `/dashboard` (After Login)
- ✓ **Search input field** in top-right
- Type to search through displayed data
- Filters data in real-time

**Search works for:**
- Bookings tab: Search by ID, Customer, Service, Location
- My Bookings tab: Search by ID, Service, Location
- Applications tab: Search by Name, Email, Category
- Revenue tab: Search by ID, Customer, Service

---

### 3️⃣ USER REGISTRATION & LOGIN

#### **Register Page**
**Path:** `/register`
- ✓ Fill all required fields:
  - Name
  - Email
  - Password
- ✓ Click "Create Account" button
- ✓ Successful registration → Redirects to Login
- ✓ Validation messages for errors

**Test Account (Pre-created):**
- Email: `user@example.com`
- Password: `password123`

---

### 4️⃣ AUTHENTICATION

#### **Login Page**
**Path:** `/login`
- ✓ Enter email and password
- ✓ Click "Login" button
- ✓ Redirects to dashboard
- ✓ Token stored in localStorage

**Admin Account (Pre-created):**
- Email: `admin@example.com`
- Password: `admin123`

---

### 5️⃣ SERVICES BOOKING

#### **Services List → Booking Flow**
**Path:** `/services`
- ✓ Click on any service card
- ✓ Navigates to `/book/:serviceId`
- ✓ Shows service details with sub-services list
- ✓ Select a sub-service
- ✓ Choose date and time
- ✓ Fill location details
- ✓ Click "Confirm Booking" button
- ✓ Booking created successfully ✓

**Features:**
- Price calculation
- Appointment date picker
- Location auto-fill from profile
- Confirmation notification

---

### 6️⃣ PARTNER APPLICATION (Job Application)

#### **Partner Page - Apply for Jobs**
**Path:** `/partner`
- ✓ Fill application form:
  - Full Name
  - Email
  - Phone
  - Category (Skill)
  - Experience
  - City
- ✓ Click "Submit Application" button
- ✓ Success message appears
- ✓ Application stored in database

**Categories Available:**
- Air Conditioner
- Beauty Salon
- Refrigerator
- Plumbing
- Electrical
- Geyser
- Cleaning
- Washing Machine
- Water Purifier

---

### 7️⃣ ADMIN DASHBOARD

#### **Login as Admin**
- Email: `admin@example.com`
- Password: `admin123`

#### **Admin Panel Features:**

**Tab 1: Employees**
- ✓ View all active employees
- ✓ Available employees section
- ✓ Add new employee button
- ✓ Toggle employee availability
- ✓ Delete employee
- ✓ View ratings and current jobs

**Tab 2: Applications** ⭐ (FIXED)
- ✓ View all pending applications
- ✓ **NEW:** Both badges now show:
  - ✓ "Added to System" 
  - ✓ "Assigned" (when auto-assigned to jobs)
- ✓ Approve button → Creates employee + auto-assigns jobs
- ✓ Reject button → Rejects application
- ✓ Status indicators (Pending, Approved, Rejected)

**Tab 3: Pending Bookings**
- ✓ View pending bookings
- ✓ Assign employee to booking
- ✓ Select employee from dropdown
- ✓ Confirm assignment

---

### 8️⃣ USER DASHBOARD

#### **Login as Regular User**
- Email: `user@example.com`
- Password: `password123`

#### **User Dashboard Features:**
- ✓ View my bookings
- ✓ See booking status (Pending, Confirmed, Completed)
- ✓ View payment info
- ✓ Appointment date and time
- ✓ Search through bookings

---

### 9️⃣ BUTTONS & INTERACTIONS

**All buttons tested:**
- ✓ "Book Services" (Home → Services)
- ✓ "Get a Job Now" (Home → Partner)
- ✓ "Create Account" (Register form)
- ✓ "Login" (Login form)
- ✓ "Confirm Booking" (Booking form)
- ✓ "Submit Application" (Partner form)
- ✓ "Search" (Services & Dashboard)
- ✓ "Approve/Reject" (Admin applications)
- ✓ "Add Employee" (Admin)
- ✓ "Assign Employee" (Admin bookings)

---

### 🔟 RESPONSIVE DESIGN

**Mobile Responsive** (Test on mobile/tablet):
- ✓ Navigation menu collapses to hamburger
- ✓ Forms responsive
- ✓ Tables horizontal scroll
- ✓ Cards responsive grid
- ✓ Search input responsive

---

## 📊 DATABASE & AUTO-SEEDING

**Backend Auto-Seeding:**
- ✓ On startup, creates 9 services
- ✓ Creates sample employees
- ✓ Creates sample bookings
- ✓ MongoDB connection: Local instance

**API Endpoints (All Tested):**
```
POST   /api/applications          - Submit job application
GET    /api/applications          - Get all applications (admin)
PUT    /api/applications/:id/approve   - Approve application
PUT    /api/applications/:id/reject    - Reject application

POST   /api/bookings              - Create booking
GET    /api/bookings              - Get all bookings (admin)
GET    /api/bookings/:id          - Get specific booking

POST   /api/services              - Get all services
GET    /api/services/:id          - Get specific service

GET    /api/employees             - Get all employees (admin)
POST   /api/employees             - Add employee (admin)

POST   /api/auth/register         - Register user
POST   /api/auth/login            - Login user

GET    /api/health                - Health check
```

---

## 🎨 UI/UX FEATURES

- ✓ Dark mode optimized design
- ✓ Glassmorphism effects
- ✓ Smooth animations
- ✓ Color-coded status badges
- ✓ Icons for visual clarity
- ✓ Loading states
- ✓ Error handling with alerts
- ✓ Form validation

---

## ✨ RECENT FIXES

1. **✓ Added Search Bars**
   - Services page search input
   - Dashboard search with filtering

2. **✓ Fixed Application Badges**
   - Now shows both "Added to System" ✓ and "Assigned" ✓
   - Backend properly sets assignedEmployeeId
   - Frontend uses complete response data

3. **✓ Auto-Assignment**
   - When application approved, employee auto-assigned to pending jobs
   - Respects max job capacity per category

---

## 🚀 DEMO SEQUENCE (5 minutes)

1. **Show Home Page** (10s)
   - Click "Book a Service"

2. **Search Services** (30s) ⭐ NEW
   - Type "Plumbing" in search
   - Show filtered results
   - Click "Search" button

3. **Book a Service** (1 min)
   - Select a service
   - Choose sub-service
   - Set date/time/location
   - Confirm

4. **Apply as Partner** (30s)
   - Fill job application
   - Submit

5. **Admin Approval** (1 min)
   - Login as admin
   - Go to Applications tab
   - Show badges (Added to System + Assigned)
   - Click Approve

6. **Search in Dashboard** (30s) ⭐ NEW
   - Type in search box
   - Show filtered results

---

## 📝 NOTES FOR EXAMINER

- All features are **fully functional**
- **Search features are NEW** - recently added
- **Bug fixes verified** - both badges now display correctly
- **Database auto-seeds** on every backend restart
- **Mobile responsive** - test on multiple devices
- **Error handling** implemented - try invalid inputs
- **Performance** - no lag on operations

---

## ✅ QUICK VERIFICATION CHECKLIST

Before examiner testing:
```
☑ Backend running on :5000
☑ Frontend running on :5173
☑ MongoDB connected
☑ Services seeded (9 total)
☑ Sample data loaded
☑ All buttons clickable
☑ Search bars functional
☑ Forms validating
☑ API endpoints responding
☑ Auth tokens working
☑ Responses showing proper data
```

**ALL SYSTEMS GO! 🚀**

---

**Last Updated:** April 20, 2026
**Status:** ✅ Ready for Examination
