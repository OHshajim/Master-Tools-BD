import axios from "axios";

// Normal API (public requests)
export  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    withCredentials: true,
});

// Secure API (admin / protected requests)
export const secureApi = axios.create({
    baseURL: import.meta.env.VITE_API_URI,
    withCredentials: true,
});

// Attach token if using JWT in headers
secureApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
