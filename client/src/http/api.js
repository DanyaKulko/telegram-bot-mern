import axios from 'axios';

const serverUrl = 'http://localhost:5050';

const api = axios.create({
    baseURL: `${serverUrl}/api`,
});

const auth_api = axios.create({
    baseURL: `${serverUrl}/api`,
});

auth_api.interceptors.request.use(async config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export {auth_api, api, serverUrl};
