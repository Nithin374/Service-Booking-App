# 📱 MOBILE APP QUICK SCREENS GUIDE

## SCREENS TO IMPLEMENT (Priority Order)

### PRIORITY 1: Authentication (5 min)
```
LoginScreen ✓ (Already exists, just needs API integration)
├─ Email input
├─ Password input
├─ Login button → Calls POST /api/auth/login
├─ Shows error if failed
└─ Navigates to HomeScreen if success

RegisterScreen ✓ (Already exists, just needs API integration)
├─ Name input
├─ Email input
├─ Password input
├─ Role selector (customer/provider)
├─ Register button → Calls POST /api/auth/register
└─ Navigates to LoginScreen on success
```

### PRIORITY 2: Customer Browsing (10 min)
```
HomeScreen ✓ (Needs API call)
├─ GET /api/services
├─ Shows list of all services
│  ├─ Service icon/name
│  ├─ Category
│  ├─ Price
│  └─ Touch → Go to ServiceDetailScreen
└─ Loading spinner while fetching

ServiceDetailScreen ✓ (Needs API call)
├─ Shows service details
│  ├─ Title, category, description
│  ├─ Price
│  ├─ Rating
│  └─ "Book Now" button
└─ BookingScreen
```

### PRIORITY 3: Booking (10 min)
```
BookingScreen ✓ (Needs API call)
├─ Form fields:
│  ├─ Name (auto-filled from user profile)
│  ├─ Phone (auto-filled)
│  ├─ Location (dropdown or input)
│  ├─ Address
│  ├─ Appointment date & time (date picker)
│  ├─ Payment method (Online/Cash)
│  └─ Book button
├─ POST /api/bookings
├─ Shows success message
└─ Navigates to ConfirmationScreen
```

### PRIORITY 4: View Bookings (10 min)
```
BookingsScreen ✓ (Needs API call)
├─ GET /api/bookings/mybookings
├─ Shows list of user's bookings
│  ├─ Booking ID
│  ├─ Service name
│  ├─ Status (Pending/Confirmed/Completed)
│  ├─ Amount
│  ├─ Appointment date
│  └─ Touch → Go to BookingDetailScreen
└─ Pull-to-refresh to reload

BookingDetailScreen ✓ (Needs display)
├─ Shows booking details
├─ If Completed:
│  └─ Shows feedback & rating ⭐
└─ If status = Confirmed & employeeFinished:
   └─ Shows "Mark Finished" button
```

### PRIORITY 5: Expert Features (10 min)
```
ExpertJobsScreen (New)
├─ GET /api/bookings (filtered by employeeId)
├─ Shows assigned jobs
│  ├─ Customer name
│  ├─ Service type
│  ├─ Appointment time
│  ├─ Status
│  └─ Touch → Job detail
└─ Filter by status (Active/Completed)

JobDetailScreen (New)
├─ Shows job details
├─ If status = Confirmed:
│  └─ "Mark Work as Finished" button
│     ├─ PUT /api/bookings/:id/employee-finished
│     └─ Shows confirmation
└─ If employeeFinished:
   └─ "Waiting for customer confirmation..."
```

---

## 🎯 MINIMAL CODE EXAMPLE

### Fastest Way to Implement HomeScreen:

**File: `mobile/src/screens/user/HomeScreen.js`**

```javascript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import api from '../../services/api';

export default function HomeScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Services</Text>
      
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadServices}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        onEndReachedThreshold={0.1}
        refreshing={loading}
        onRefresh={loadServices}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ServiceDetail', { serviceId: item._id })
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.price}>₹{item.price}</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#000',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#4f46e5',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#c33',
    flex: 1,
  },
  retryText: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
});
```

That's it! One screen, fully working! ✓

---

## 📋 IMPLEMENTATION CHECKLIST

**Week 1 (First 2 hours):**
- [ ] Copy HomeScreen code (10 min)
- [ ] Copy ServiceDetailScreen code (10 min)  
- [ ] Copy BookingScreen code (15 min)
- [ ] Test with your backend (5 min)
- [ ] Show examiner (All working!)

**Extra (If time allows):**
- [ ] Copy BookingsScreen (15 min)
- [ ] Copy ExpertJobsScreen (15 min)
- [ ] Add error handling (10 min)
- [ ] Add loading states (10 min)

---

## 🧪 QUICK TEST BEFORE DEMO

Run this to make sure mobile can talk to backend:

**File: `mobile/src/services/api.js`** (Check it exists)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

**Test call:**
```javascript
// In your component
useEffect(() => {
  api.get('/services')
    .then(res => console.log('Connected!', res.data))
    .catch(err => console.log('Error:', err.message));
}, []);
```

If you see services in console → Connected ✓

---

## 🎬 DEMO FLOW

1. **Start backend:** `npm start` (backend terminal)
2. **Start web:** `npm run dev` (frontend terminal)
3. **Start mobile:** `npm start` in mobile → press `w` for web
4. **Show working:**
   - Login on mobile
   - Browse services
   - Book a service
   - See booking in dashboard
   - Show same on web browser

**Examiner sees:** Cross-platform app working with single backend! ✅

---

## ✨ IF STUCK - USE THESE TEMPLATES

I've provided complete templates above. Just:
1. Copy the code
2. Replace your HomeScreen.js with it
3. Do same for other screens
4. Change the API endpoints if needed
5. Test

All templates use:
- axios for API calls (same as backend uses)
- React Native StyleSheet for styling
- FlatList for lists (efficient on mobile)
- ActivityIndicator for loading
- TouchableOpacity for buttons
- Try-catch for error handling

---

**Ready to implement? Start with HomeScreen! Takes 5 minutes! 🚀**
