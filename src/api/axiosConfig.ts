import { getToken } from '@configs/firebaseUtils';
import axios from 'axios';

export const protectedApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

protectedApi.interceptors.request.use(async (config) => {
    const firebaseJwtToken = await getToken();

    if (firebaseJwtToken) {
        config.headers.Authorization = `Bearer ${firebaseJwtToken}`;
    }

    return config;
});
