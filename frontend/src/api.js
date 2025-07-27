import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

export async function registerUser(userData) {
    try {
        const response = await axios.post(`${BACKEND_URL}/register`, {
            username: userData.username,
            email: userData.email,
            password: userData.password
        });
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}

export async function loginUser(credentials) {
    try {
        const response = await axios.post(`${BACKEND_URL}/login`, {
            login: credentials.login,
            password: credentials.password
        });
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}

export async function logoutUser(token) {
    try {
        const response = await axios.delete(`${BACKEND_URL}/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}