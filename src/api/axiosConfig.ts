import { getToken } from '@configs/firebaseUtils';
import store from '@store/store';
import axios from 'axios';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus, type Information } from '@models/informationType';

const BaseUrl = import.meta.env.VITE_API_URL;

export const unauthorizedApi = axios.create({
    baseURL: BaseUrl,
});

export const  authorizedApi = axios.create({
    baseURL: BaseUrl,
});

authorizedApi.interceptors.request.use(async (request) => {
    const firebaseJwtToken = await getToken();
    if (firebaseJwtToken) {
        request.headers.Authorization = `Bearer ${firebaseJwtToken}`;
    }

    return request;
});

function getErrorMessage(data: unknown): Information {
    if (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof (data as { error?: unknown }).error === 'string'
    ) {
        return { infoMessage: String(data.error), status: InfoMessageStatus.Error };
    }

    return { infoMessage: '', status: InfoMessageStatus.None };
}

authorizedApi.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        const message = getErrorMessage(error.response?.data);

        store.dispatch(addInfo(message));

        return Promise.reject(error);
    },
);
