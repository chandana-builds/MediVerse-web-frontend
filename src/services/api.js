import axios from 'axios';

// 1. Set your live Railway URL as the base
const API = axios.create({
    baseURL: 'https://mediverse-backend-production.up.railway.app/api'
});

export const authService = {
    // 2. Ensure the path matches your server.js: /auth/login/patient
    loginPatient: async (data) => {
        const res = await API.post('/auth/login/patient', data);
        return res.data;
    },
    registerPatient: async (data) => {
        const res = await API.post('/auth/register/patient', data);
        return res.data;
    }
};

export const patientService = {
    updateData: async (data) => {
        const res = await API.post('/patient/update', data);
        return res.data;
    }
};

export const emergencyService = {
    trigger: async (userId, location) => {
        const res = await API.post('/emergency/trigger', { userId, location });
        return res.data;
    }
};

export const socket = {
    // If you use sockets, they usually connect to the root URL, not /api
    url: 'https://mediverse-backend-production.up.railway.app'
};