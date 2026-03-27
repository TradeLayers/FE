import { authrorizedApi } from './axiosConfig';
import { type User } from '@models/userTypes';

export const createOrFetchUser = async (): Promise<User> => {
    const response = await authrorizedApi.post<User>('/user');
    return response.data;
};
