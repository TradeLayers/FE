export type User = {
    name: string;
    firebaseId?: string;
    email?: string;
    balance?: number;
    createdAt?: Date;
    lastOnline?: Date;
};

export const isGuest = (user: User): boolean => {
    return user.name === 'Guest';
};

export const isUser = (user: User): boolean => {
    return !isGuest(user);
};

export type UserFields = {
    name?: string;
    email?: string;
};
