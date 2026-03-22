import { protectedApi } from "./axiosConfig";
import { type User } from "@models/userTypes";

export const createOrFetchUser = async (): Promise<User> => {
    const response = await protectedApi.post<User>('/user');
    return response.data
}