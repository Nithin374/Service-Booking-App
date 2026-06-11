import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Import screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/user/HomeScreen';
import ServicesScreen from './src/screens/user/ServicesScreen';
import ServiceDetailScreen from './src/screens/user/ServiceDetailScreen';
import BookingScreen from './src/screens/user/BookingScreen';
import BookingsScreen from './src/screens/user/BookingsScreen';
import PartnerScreen from './src/screens/partner/PartnerScreen';
import PartnerApplicationScreen from './src/screens/partner/PartnerApplicationScreen';
import DashboardScreen from './src/screens/admin/DashboardScreen';
import ProfileScreen from './src/screens/user/ProfileScreen';

// Icons from lucide-react-native
import { Home, ShoppingCart, Briefcase, User, LayoutDashboard } from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigation Stack
const AuthStack = () => {
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
};

// User Navigation Stack
const UserStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#f8fafc',
                    borderBottomColor: '#e2e8f0',
                    borderBottomWidth: 1,
                },
                headerTintColor: '#0f172a',
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name="HomeStack"
                    component={HomeScreen}
                    options={{ title: 'Home', headerShown: false }}
                />
                <Stack.Screen
                    name="Services"
                    component={ServicesScreen}
                    options={{ title: 'Services' }}
                />
                <Stack.Screen
                    name="ServiceDetail"
                    component={ServiceDetailScreen}
                    options={{ title: 'Service Details' }}
                />
                <Stack.Screen
                    name="Booking"
                    component={BookingScreen}
                    options={{ title: 'Book Service' }}
                />
                <Stack.Screen
                    name="Bookings"
                    component={BookingsScreen}
                    options={{ title: 'My Bookings' }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: 'My Profile' }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};

// Partner Navigation Stack
const PartnerStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#f8fafc',
                    borderBottomColor: '#e2e8f0',
                    borderBottomWidth: 1,
                },
                headerTintColor: '#0f172a',
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
            }}
        >
            <Stack.Screen
                name="PartnerHome"
                component={PartnerScreen}
                options={{ title: 'Become a Partner', headerShown: false }}
            />
            <Stack.Screen
                name="PartnerApplication"
                component={PartnerApplicationScreen}
                options={{ title: 'Submit Application' }}
            />
        </Stack.Navigator>
    );
};

// Admin Dashboard Stack
const AdminStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#f8fafc',
                    borderBottomColor: '#e2e8f0',
                    borderBottomWidth: 1,
                },
                headerTintColor: '#0f172a',
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
            }}
        >
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Dashboard' }}
            />
        </Stack.Navigator>
    );
};

// Main User Tab Navigator
const UserTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1e40af',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    backgroundColor: '#f8fafc',
                    borderTopColor: '#e2e8f0',
                    borderTopWidth: 1,
                    paddingBottom: 5,
                    paddingTop: 8,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    marginTop: -5,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="HomeTabStack"
                component={UserStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="BookingsTab"
                component={BookingsScreen}
                options={{
                    tabBarLabel: 'Bookings',
                    tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="PartnerTab"
                component={PartnerStack}
                options={{
                    tabBarLabel: 'Partner',
                    tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};

// Root Navigation
const RootNavigator = ({ userRole }) => {
    if (userRole === 'admin') {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="AdminStack" component={AdminStack} />
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="UserTabs" component={UserTabNavigator} />
        </Stack.Navigator>
    );
};

export default function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1e40af" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? (
                <RootNavigator userRole={user.role} />
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
}
