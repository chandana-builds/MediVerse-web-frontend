import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = "mediverse-backend-production.up.railway.app";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const socket = io(API_BASE_URL);

export const authService = {
    loginPatient: async (credentials) => {
        const { data } = await api.post('/api/auth/login/patient', credentials);
        return data;
    },
    registerPatient: async (userData) => {
        const { data } = await api.post('/api/auth/register/patient', userData);
        return data;
    },
    loginDoctor: async (credentials) => {
        const { data } = await api.post('/api/auth/login/doctor', credentials);
        return data;
    },
};

export const patientService = {
    updateData: async (userData) => {
        const { data } = await api.post('/api/patient/update', userData);
        return data;
    },
};

export const emergencyService = {
    trigger: async (patientId, gps) => {
        const { data } = await api.post('/api/emergency/trigger', { patientId, gps });
        return data;
    },
};

export default api;
