import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('sow_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting token:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired, handle logout
            AsyncStorage.removeItem('sow_token');
            AsyncStorage.removeItem('sow_user');
        }
        return Promise.reject(error);
    }
);

export default api;
