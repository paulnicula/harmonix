import axios from 'axios';

const getCSRFToken = () => {
    const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken'));
    if (csrfCookie) {
        return csrfCookie.split('=')[1];
    }
    return null;
};

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
