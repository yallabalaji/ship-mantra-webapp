import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API = axios.create({
    baseURL: "https://ship-mantra.onrender.com", // Change this to match your backend URL
});

// Define a function to get the token safely
const getToken = (): string | null => {
    return localStorage.getItem("token");
};

// Attach JWT token to every request
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors (Auto logout on 401)
API.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default API;
