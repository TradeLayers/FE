export const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);

export const formatQuantity = (value: number): string =>
    new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 4,
    }).format(value);

export const formatDate = (isoDate: string): string => new Date(isoDate).toLocaleDateString();

export const formatDateTime = (isoDate: string): string => new Date(isoDate).toLocaleString();
