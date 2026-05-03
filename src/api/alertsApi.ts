import { authorizedApi } from './axiosConfig';
import { type CreateAlertRequest, type PriceAlert } from '@models/alertTypes';

export const getAlerts = async (): Promise<PriceAlert[]> => {
    const response = await authorizedApi.get<PriceAlert[]>('/alerts');
    return response.data;
};

export const createAlert = async (request: CreateAlertRequest): Promise<PriceAlert> => {
    const response = await authorizedApi.post<PriceAlert>('/alerts', request);
    return response.data;
};

export const deleteAlert = async (id: string): Promise<void> => {
    await authorizedApi.delete(`/alerts/${id}`);
};
