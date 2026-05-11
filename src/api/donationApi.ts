import { unauthorizedApi } from './axiosConfig';

export type DonationCheckoutRequest = {
    amountCents: number;
    successUrl: string;
    cancelUrl: string;
};

type DonationCheckoutResponse = {
    checkoutUrl: string;
};

export const createDonationCheckoutSession = async (
    request: DonationCheckoutRequest,
): Promise<DonationCheckoutResponse> => {
    const response = await unauthorizedApi.post<DonationCheckoutResponse>(
        '/donations/checkout',
        request,
    );
    return response.data;
};
