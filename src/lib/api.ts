import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    me: () => api.get('/auth/me'),
};

// Dashboard
export const dashboardApi = {
    getStats: () => api.get('/admin/stats'),
};

// Products
export const productsApi = {
    getAll: () => api.get('/admin/products'),
    getOne: (id: string) => api.get(`/admin/products/${id}`),
    create: (data: any) => api.post('/admin/products', data),
    update: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
    delete: (id: string) => api.delete(`/admin/products/${id}`),
};

// Categories
export const categoriesApi = {
    getAll: () => api.get('/admin/categories'),
    create: (data: any) => api.post('/admin/categories', data),
};

// Banners
export const bannersApi = {
    getAll: () => api.get('/admin/banners'),
    create: (data: any) => api.post('/admin/banners', data),
    update: (id: string, data: any) => api.put(`/admin/banners/${id}`, data),
    delete: (id: string) => api.delete(`/admin/banners/${id}`),
};

// Testimonials
export const testimonialsApi = {
    getAll: () => api.get('/admin/testimonials'),
    create: (data: any) => api.post('/admin/testimonials', data),
    update: (id: string, data: any) => api.put(`/admin/testimonials/${id}`, data),
    delete: (id: string) => api.delete(`/admin/testimonials/${id}`),
};

// FAQs
export const faqsApi = {
    getAll: () => api.get('/admin/faqs'),
    create: (data: any) => api.post('/admin/faqs', data),
    update: (id: string, data: any) => api.put(`/admin/faqs/${id}`, data),
    delete: (id: string) => api.delete(`/admin/faqs/${id}`),
};

// Inquiries
export const inquiriesApi = {
    getAll: () => api.get('/admin/inquiries'),
    update: (id: string, data: any) => api.put(`/admin/inquiries/${id}`, data),
    delete: (id: string) => api.delete(`/admin/inquiries/${id}`),
};

// Settings
export const settingsApi = {
    get: () => api.get('/admin/settings'),
    update: (data: any) => api.put('/admin/settings', data),
};

// Upload
export const uploadApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/admin/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default api;
