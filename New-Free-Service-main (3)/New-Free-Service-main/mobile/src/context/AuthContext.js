import React, { useState, useContext, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Load user from AsyncStorage on app start
    useEffect(() => {
        const loadStoredUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('sow_user');
                const storedToken = await AsyncStorage.getItem('sow_token');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStoredUser();
    }, []);

    const login = async (userData, authToken) => {
        try {
            setUser(userData);
            setToken(authToken);
            await AsyncStorage.setItem('sow_user', JSON.stringify(userData));
            await AsyncStorage.setItem('sow_token', authToken);
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            setToken(null);
            await AsyncStorage.removeItem('sow_user');
            await AsyncStorage.removeItem('sow_token');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
