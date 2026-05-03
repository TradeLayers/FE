export type AlertDirection = 'above' | 'below';

export type PriceAlert = {
    id: string;
    symbol: string;
    name: string;
    thresholdPrice: number;
    direction: AlertDirection;
    currentPrice: number;
    triggeredAt: string | null;
    createdAt: string;
};

export type CreateAlertRequest = {
    symbol: string;
    thresholdPrice: number;
    direction: AlertDirection;
};
