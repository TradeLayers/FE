import { authorizedApi } from './axiosConfig';
import { type User, type UserFields } from '@models/userTypes';
import { type AxiosRequestConfig } from 'axios';

const withIdToken = (idToken?: string): AxiosRequestConfig | undefined => {
    if (!idToken) {
        return undefined;
    }

    return {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    };
};

export const createOrFetchUser = async (idToken?: string): Promise<User> => {
    const response = await authorizedApi.post<User>('/user', undefined, withIdToken(idToken));
    return response.data;
};

export const updateUserFields = async (fieldsObj: UserFields): Promise<User> => {
    const response = await authorizedApi.patch<User>('/user', fieldsObj);
    return response.data;
};

export const deleteUser = async (): Promise<void> => {
    await authorizedApi.delete('/user');
};
