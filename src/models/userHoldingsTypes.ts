import { type Stock } from './stockTypes';

export type UserHoldings = {
    stock: Stock;
    quantity: number;
};

export type AllUserHoldings = {
    userHoldings: UserHoldings[];
};
