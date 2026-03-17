export enum UserType { 
    Guest = 'Guest',
    User = 'Admin' 
};

export type User = {
    userType: UserType;
    name: string;
    firebaseId?: string;
    email?: string;
};