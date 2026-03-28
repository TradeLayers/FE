import { authorizedApi } from './axiosConfig';
import { type User, type UserFields } from '@models/userTypes';

export const createOrFetchUser = async (): Promise<User> => {
    const response = await authorizedApi.post<User>('/user');
    return response.data;
};

export const updateUserFields = async (fieldsObj: UserFields): Promise<User> => {
    const response = await authorizedApi.patch<User>('/user', fieldsObj);
    return response.data;
};

export const deleteUser = async (): Promise<void> => {
    await authorizedApi.delete('/user');
};
