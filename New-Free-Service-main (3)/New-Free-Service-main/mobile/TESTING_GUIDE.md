# Mobile App - Testing & Verification Guide

## 🧪 Complete Testing Checklist

Use this guide to verify all features work correctly.

---

## 1. SETUP & INSTALLATION ✓

### Install Dependencies
```bash
cd mobile
npm install
# Wait for all packages to install
```

### Check Node Version
```bash
node --version
# Should be v14 or higher
```

### Start Expo Server
```bash
npm start
# You should see:
# › Metro waiting on exp://...
# › Scan the QR code above with Expo Go!
```

---

## 2. AUTHENTICATION TESTING

### 2.1 Login Screen
- [ ] Open app → See login screen
- [ ] Enter invalid email → Error message appears
- [ ] Enter invalid password → Error message appears
- [ ] Leave fields empty → "Please fill in all fields" error
- [ ] Enter valid credentials → Login succeeds
- [ ] User data appears in AsyncStorage
- [ ] App navigates to Home screen

### 2.2 Register Screen
- [ ] Tap "Register here" → Navigate to register
- [ ] Try to register with existing email → Error appears
- [ ] Leave any field empty → Validation error
- [ ] Password less than 6 chars → Error message
- [ ] Fill all fields correctly → Account created
- [ ] Auto-login after registration
- [ ] Navigate to Home screen

### 2.3 Logout
- [ ] Go to Profile tab
- [ ] Tap "Logout" button
- [ ] Confirm logout → Back to login screen
- [ ] User data cleared from AsyncStorage
- [ ] Cannot go back to home without login

---

## 3. SERVICE BROWSING TESTING

### 3.1 Home Screen
- [ ] See welcome message with username
- [ ] See "Popular Services" section
- [ ] See at least 5 services displayed
- [ ] Each service shows: icon, name, category, price
- [ ] "See all" link navigates to Services screen
- [ ] "View My Bookings" link works
- [ ] "Become a Partner" link works
- [ ] Logout button visible and works

### 3.2 Services Screen
- [ ] See all services in list
- [ ] Service count matches database
- [ ] Search bar works
  - [ ] Type "AC" → Filter to air conditioner services
  - [ ] Clear search → Show all services again
- [ ] Category filter works
  - [ ] Click "All" → Show all services
  - [ ] Click category → Show only that category
  - [ ] Selected category highlighted in blue
- [ ] Tap service card → Navigate to details
- [ ] "Book Now" button works

### 3.3 Service Detail Screen
- [ ] Large service icon displayed
- [ ] Service name and category shown
- [ ] Star rating displayed (⭐⭐⭐⭐)
- [ ] Price section is prominent
- [ ] Description fully visible
- [ ] "What's Included" section visible
- [ ] Availability days shown
- [ ] "Book This Service" button visible
- [ ] Back button works

---

## 4. BOOKING SYSTEM TESTING

### 4.1 Create Booking
- [ ] Tap "Book This Service" button
- [ ] Navigate to Booking screen
- [ ] Service details displayed
- [ ] Tap date button → Date picker modal opens
- [ ] Select date in modal → Date updates
- [ ] Tap time button → Time picker modal opens
- [ ] Select time in modal → Time updates
- [ ] Enter service address → Field filled
- [ ] Enter optional notes → Field filled
- [ ] Booking summary shows correct details
- [ ] Total price displayed correctly
- [ ] Tap "Confirm Booking" → Success alert
- [ ] Navigate to Bookings screen

### 4.2 View Bookings
- [ ] See all bookings in list
- [ ] Each booking shows:
  - [ ] Booking ID
  - [ ] Status badge (color-coded)
  - [ ] Date and time
  - [ ] Service address
  - [ ] Total price
- [ ] Filter by status works:
  - [ ] "All" → Show all bookings
  - [ ] "Pending" → Show only pending
  - [ ] "Confirmed" → Show only confirmed
  - [ ] Selected filter is highlighted

### 4.3 Cancel Booking
- [ ] Tap on pending booking
- [ ] See "Cancel Booking" button
- [ ] Tap cancel → Confirmation dialog
- [ ] Confirm cancellation → Status changes
- [ ] Cancelled bookings show ❌ status
- [ ] Cannot cancel completed bookings

### 4.4 Pull to Refresh
- [ ] On Bookings screen
- [ ] Pull down with finger
- [ ] Refresh icon animates
- [ ] Bookings list reloads
- [ ] New bookings appear if created

---

## 5. USER PROFILE TESTING

### 5.1 View Profile
- [ ] Navigate to Profile tab
- [ ] See user avatar with initial
- [ ] Username displayed
- [ ] User role shown (User/Administrator)
- [ ] Profile information visible:
  - [ ] Email
  - [ ] Phone number
  - [ ] Address
  - [ ] Role

### 5.2 Edit Profile
- [ ] Tap "Edit" button
- [ ] Form fields become editable
- [ ] Update name → Changes reflected
- [ ] Update phone → Phone format flexible
- [ ] Add address → Multiline input works
- [ ] Leave any field empty → Error message
- [ ] Tap "Save Changes" → Success message
- [ ] Changes persist after refresh
- [ ] Tap "Cancel" → Discard changes

### 5.3 Logout from Profile
- [ ] Tap "Logout" button
- [ ] Confirmation dialog appears
- [ ] Confirm logout → Return to login
- [ ] User data cleared
- [ ] Cannot access app without login

---

## 6. PARTNER PROGRAM TESTING

### 6.1 Partner Information Screen
- [ ] Navigate to Partner tab
- [ ] See program overview
- [ ] Benefits displayed (📱💰⭐🛡️)
- [ ] Requirements listed
- [ ] "Apply Now" button visible
- [ ] All text readable and formatted

### 6.2 Submit Application
- [ ] Tap "Apply Now"
- [ ] Navigate to application form
- [ ] Select service category from dropdown
- [ ] Enter years of experience (number only)
- [ ] Enter phone number
- [ ] Write bio/description
- [ ] Leave any field empty → Error message
- [ ] Tap "Submit Application" → Success alert
- [ ] Navigate back to Partner screen

### 6.3 Application Status
- [ ] Check Partner screen again
- [ ] See application status displayed
- [ ] If pending: ⏳ PENDING status shown
- [ ] If approved: ✅ APPROVED with success message
- [ ] If rejected: ❌ REJECTED with reason
- [ ] Can reapply if rejected (button visible)

---

## 7. ADMIN TESTING (if admin user)

### 7.1 Admin Dashboard Access
- [ ] Login with admin account
- [ ] Automatically navigate to Dashboard
- [ ] Not to regular home/bookings screens
- [ ] Dashboard screen loads

### 7.2 View Statistics
- [ ] Total Users count displayed
- [ ] Total Bookings count displayed
- [ ] Pending Applications count displayed
- [ ] Each stat card has icon and color
- [ ] Numbers update when data changes

### 7.3 Manage Applications
- [ ] Pending applications section visible
- [ ] Each application shows:
  - [ ] User ID
  - [ ] Service category
  - [ ] Years of experience
  - [ ] Bio/description
  - [ ] ⏳ PENDING status badge
- [ ] Approve button works:
  - [ ] Tap "Approve" → Confirmation dialog
  - [ ] Confirm → Application approved
  - [ ] Application moves to approved list
- [ ] Reject button works:
  - [ ] Tap "Reject" → Confirmation dialog
  - [ ] Confirm → Application rejected
  - [ ] Application removed from pending

### 7.4 Applications Summary
- [ ] See grid of application statuses
- [ ] Count of approved applications
- [ ] Count of pending applications
- [ ] Count of rejected applications
- [ ] Numbers update in real-time

### 7.5 Admin Logout
- [ ] Tap logout button
- [ ] Confirmation dialog appears
- [ ] Confirm → Return to login screen

---

## 8. NETWORK & CONNECTIVITY TESTING

### 8.1 Offline Behavior
- [ ] Disconnect from WiFi
- [ ] Try to load services → Error alert
- [ ] Try to create booking → Error message
- [ ] Reconnect to WiFi
- [ ] Screens load correctly again

### 8.2 Slow Network
- [ ] Open network throttle in chrome DevTools
- [ ] Set to slow 4G
- [ ] Perform actions
- [ ] Loading spinners appear
- [ ] Requests complete after delay
- [ ] App doesn't crash

### 8.3 API Error Handling
- [ ] Try login with wrong password → "Invalid credentials"
- [ ] Try register with duplicate email → "Email already exists"
- [ ] Try create booking without address → "Please fill in all fields"
- [ ] All errors show user-friendly messages

---

## 9. UI/UX VALIDATION

### 9.1 Responsive Design
- [ ] Test on different device sizes (if using emulator)
- [ ] Test in portrait mode → No overflow, proper spacing
- [ ] Test in landscape mode → Responsive layout
- [ ] All buttons easily tappable (min 44x44 points)
- [ ] Text readable on all devices

### 9.2 Color Scheme
- [ ] Primary color: Blue (#1e40af)
- [ ] Success: Green (#10b981)
- [ ] Warning: Amber (#f59e0b)
- [ ] Error: Red (#ef4444)
- [ ] Consistent throughout app

### 9.3 Navigation Feedback
- [ ] Active tabs highlighted
- [ ] Current screen clear
- [ ] Back buttons work on all screens
- [ ] No navigation loops

### 9.4 Form Validation
- [ ] Invalid email shows error
- [ ] Empty fields show error
- [ ] Long text wraps properly
- [ ] Dropdowns show all options
- [ ] Date picker month/day/year separate

---

## 10. PERFORMANCE TESTING

### 10.1 App Launch
- [ ] Open app → Loads in < 3 seconds
- [ ] Splash screen shows briefly
- [ ] Navigation initializes smoothly

### 10.2 Screen Transitions
- [ ] Navigate between screens smoothly
- [ ] No lag or stutter
- [ ] Animations are fluid
- [ ] Back navigation is instant

### 10.3 List Performance
- [ ] Services list scrolls smoothly (60 FPS)
- [ ] Bookings list scrolls smoothly
- [ ] No slowdown with many items
- [ ] Pull to refresh is responsive

### 10.4 API Performance
- [ ] Login completes in < 2 seconds
- [ ] Service list loads in < 2 seconds
- [ ] Individual requests don't timeout

---

## 11. SECURITY TESTING

### 11.1 Token Security
- [ ] JWT token stored securely
- [ ] Token sent in Authorization header
- [ ] Token expires properly
- [ ] Expired token triggers logout

### 11.2 Password
- [ ] Password field shows/hides correctly
- [ ] Passwords never logged
- [ ] Password validation enforced (min 6 chars)

### 11.3 User Data
- [ ] User data only accessible when logged in
- [ ] Cannot access routes without authentication
- [ ] Logout clears all user data

---

## 12. INTEGRATION TESTING

### Full User Journey - Customer Flow
```
1. Register new account
   ↓
2. Browse services on Home screen
   ↓
3. Search for specific service
   ↓
4. View service details
   ↓
5. Create booking with date/time
   ↓
6. Confirm booking success
   ↓
7. View in Bookings list
   ↓
8. Edit profile
   ↓
9. Apply to partner program
   ↓
10. Check application status
   ↓
11. Logout
```

### Full User Journey - Admin Flow
```
1. Login as admin
   ↓
2. See Dashboard with statistics
   ↓
3. Review pending applications
   ↓
4. Approve or reject application
   ↓
5. See updated statistics
   ↓
6. Logout
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server"
- ✅ Solution: Check `.env.local` has correct IP
- ✅ Solution: Make sure backend is running
- ✅ Solution: Both app and backend on same network

### Issue: "Module not found" error
- ✅ Solution: Run `npm install` again
- ✅ Solution: Clear Expo cache: `expo start --clear`

### Issue: Date picker not showing
- ✅ Solution: This is normal - uses modal dialog
- ✅ Solution: Tap the date field to open modal

### Issue: Images not loading
- ✅ Solution: Using emoji icons instead
- ✅ Solution: Format: `item.imageIcon || '📦'`

### Issue: Stuck on loading screen
- ✅ Solution: Check backend logs for errors
- ✅ Solution: Restart app by scanning QR again

---

## ✅ Final Verification

Before considering production ready, verify:

- [ ] All 10 screens load without errors
- [ ] Authentication works (login, register, logout)
- [ ] Services can be browsed and searched
- [ ] Bookings can be created and cancelled
- [ ] Partner application can be submitted
- [ ] Admin can approve/reject applications
- [ ] User profile can be edited
- [ ] All navigation works
- [ ] No console errors
- [ ] App doesn't crash on any action
- [ ] Backend API properly configured
- [ ] Environment variables set correctly
- [ ] Tested on both Android and iOS

---

## 📊 Test Results Template

Copy and fill this out:

```
App Version: 1.0.0
Test Date: __/__/____
Tester: ___________
Device: __________ (Android/iOS)
OS Version: _______

PASSED: [ ] [ ] [ ] (count)
FAILED: [ ] [ ] [ ] (count)
SKIPPED: [ ] (count)

Issues Found:
1. _________________________
2. _________________________

Ready for Production: YES / NO
```

---

**Happy Testing! 🚀**
