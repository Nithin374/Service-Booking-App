import api from './api';

// Auth Services
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
};

// Service Services
export const serviceService = {
    getAll: async (filters = {}) => {
        const response = await api.get('/services', { params: filters });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },

    search: async (query) => {
        const response = await api.get('/services/search', { params: { q: query } });
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/services/categories');
        return response.data;
    },
};

// Booking Services
export const bookingService = {
    create: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/bookings/${id}`, data);
        return response.data;
    },

    cancel: async (id) => {
        const response = await api.post(`/bookings/${id}/cancel`);
        return response.data;
    },
};

// Application Services
export const applicationService = {
    create: async (applicationData) => {
        const response = await api.post('/applications', applicationData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/applications');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/applications/${id}`, data);
        return response.data;
    },

    approve: async (id) => {
        const response = await api.post(`/applications/${id}/approve`);
        return response.data;
    },

    reject: async (id) => {
        const response = await api.post(`/applications/${id}/reject`);
        return response.data;
    },
};

// User Services
export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
};
