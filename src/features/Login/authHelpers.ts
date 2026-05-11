export const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const getAuthErrorCode = (error: unknown): string | null => {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return null;
    }

    return typeof error.code === 'string' ? error.code : null;
};
