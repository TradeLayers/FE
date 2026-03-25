import { protectedApi } from './axiosConfig';
import { type User, type UserFields } from '@models/userTypes';

export const createOrFetchUser = async (): Promise<User> => {
    const response = await protectedApi.post<User>('/user');
    return response.data;
};

export const updateUserFields = async (fieldsObj: UserFields): Promise<User> => {
    const response= await protectedApi.patch('/user', fieldsObj)
    return response.data
}

export const deleteUser = async () => {
    await protectedApi.delete('/user')
}
