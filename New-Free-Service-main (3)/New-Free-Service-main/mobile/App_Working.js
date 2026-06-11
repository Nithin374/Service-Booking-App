import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from './src/context/AuthContext';

// Import screens
import LoginScreen from './src/screens/auth/LoginScreen_New';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/user/HomeScreen';
import BookingScreen from './src/screens/user/BookingScreen_New';
import BookingsScreen from './src/screens/user/BookingsScreen_New';
import ExpertJobsScreen from './src/screens/admin/ExpertJobsScreen_New';
import PartnerApplicationScreen from './src/screens/partner/PartnerApplicationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>📅</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="PartnerTab"
        component={PartnerApplicationScreen}
        options={{
          tabBarLabel: 'Partner',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>🤝</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function ExpertTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>🔧</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={ExpertJobsScreen}
        options={{
          tabBarLabel: 'My Jobs',
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>💼</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Group screenOptions={{ animationEnabled: true }}>
            <Stack.Screen name="Auth" component={AuthStack} />
          </Stack.Group>
        ) : user.role === 'provider' || user.role === 'employee' ? (
          <Stack.Group screenOptions={{ animationEnabled: true }}>
            <Stack.Screen name="ExpertMain" component={ExpertTabs} />
          </Stack.Group>
        ) : (
          <Stack.Group screenOptions={{ animationEnabled: true }}>
            <Stack.Screen name="Main" component={UserTabs} />
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{
                cardStyle: { backgroundColor: 'transparent' },
                animationEnabled: true,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
