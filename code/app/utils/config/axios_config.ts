import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3036';
const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = getAuthToken();

        const isPublicRoute = PUBLIC_ROUTES.some(route => config.url?.startsWith(route));

        if (token && config.headers && !isPublicRoute) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: any) => Promise.reject(error)
);

api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: any) => {
        console.error('Erro na requisição:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;