

import axios from 'axios';

// 1. Set your live Railway URL as the base
const API = axios.create({
    //baseURL: 'http://localhost:5000/api'
    baseURL: 'https://mediverse-backend-production.up.railway.app/api'
});

export const authService = {
    // Patient Auth
    loginPatient: async (data) => {
        const res = await API.post('/auth/login/patient', data);
        return res.data;
    },
    registerPatient: async (data) => {
        const res = await API.post('/auth/register/patient', data);
        return res.data;
    },

    // Doctor Auth
    loginDoctor: async (data) => {
        const res = await API.post('/auth/login/doctor', data);
        return res.data;
    },
    registerDoctor: async (data) => {
        const res = await API.post('/auth/register/doctor', data);
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
    url: 'https://mediverse-backend-production.up.railway.app'
};