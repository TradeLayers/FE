export enum UserType { 
    Guest = 'Guest',
    User = 'Admin' 
};

export type User = {
    userType: UserType;
    name: string;
    picture?: string;
    email?: string;
};