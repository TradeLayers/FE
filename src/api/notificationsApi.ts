import { authorizedApi } from './axiosConfig';
import { type ThresholdNotification } from '@models/notificationTypes';

export const getUnreadNotifications = async (): Promise<ThresholdNotification[]> => {
    const response = await authorizedApi.get<ThresholdNotification[]>('/notifications/unread');
    return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
    await authorizedApi.patch(`/notifications/${encodeURIComponent(id)}/read`);
};