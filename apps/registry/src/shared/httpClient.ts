import { HttpClient, HttpError } from '@/common/HttpClient';

export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export enum CookieKey {
    IS_LOGGED = '__is_logged_in__',
    AVATAR_URL = '__avatar_url__',
}

export const httpClient = HttpClient.create({
    baseURL: import.meta.env.PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Vayload-Request': 'true',
    },
    withCredentials: true,
    timeout: 30000,
});

export const publicHttpClient = HttpClient.create({
    baseURL: import.meta.env.PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Vayload-Request': 'true',
    },
    timeout: 30000,
});

publicHttpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    },
);

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: typeof error.config & { _retry?: boolean } = error.config;
        const { response } = error;

        if (response?.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes('/auth/refresh-token')) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = httpClient
                    .post('/auth/refresh-token')
                    .then(() => {})
                    .finally(() => {
                        isRefreshing = false;
                        refreshPromise = null;
                    });
            }

            await refreshPromise;

            return httpClient.request(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    },
);
