export type ThresholdNotification = {
    id: string;
    symbol: string;
    thresholdPrice: number;
    triggerPrice: number;
    triggeredAt: string;
    message: string;
};
