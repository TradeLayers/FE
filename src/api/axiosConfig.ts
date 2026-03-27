import { getToken } from '@configs/firebaseUtils';
import axios from 'axios';

const BaseUrl = import.meta.env.VITE_API_URL

export const unauthorizedApi = axios.create({
    baseURL: BaseUrl
})

export const authrorizedApi = axios.create({
    baseURL: BaseUrl
});

authrorizedApi.interceptors.request.use(async (config) => {
    const firebaseJwtToken = await getToken();
    config.headers.Authorization = `Bearer ${firebaseJwtToken}`;
    return config;
});

authrorizedApi.interceptors.response.use(async (config) => {
    return config
})
