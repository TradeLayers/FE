import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { createDonationCheckoutSession } from '@api/donationApi';

const presetAmounts = [5, 10, 25, 50];
const minDonationAmount = 1;
const maxDonationAmount = 500;

const normalizeCurrency = (currency: string | undefined): string => {
    const candidate = (currency || 'EUR').toUpperCase();

    try {
        new Intl.NumberFormat(undefined, { style: 'currency', currency: candidate }).format(1);
        return candidate;
    } catch {
        return 'EUR';
    }
};

const getCurrencySymbol = (currency: string): string => {
    const parts = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).formatToParts(0);

    return parts.find((part) => part.type === 'currency')?.value ?? currency;
};

const getApiErrorMessage = (error: unknown): string => {
    if (isAxiosError<{ error?: string }>(error)) {
        const message = error.response?.data?.error;
        if (message) {
            return message;
        }
    }

    return 'Could not start checkout. Please try again later.';
};

const DonationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
    const [customAmount, setCustomAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const donationUrl = import.meta.env.VITE_DONATION_URL as string | undefined;
    const currency = useMemo(
        () => normalizeCurrency(import.meta.env.VITE_DONATION_CURRENCY as string | undefined),
        [],
    );
    const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

    const customAmountNumber = Number(customAmount);
    const donationAmount = customAmount.trim() === '' ? selectedAmount : customAmountNumber;
    const amountIsValid =
        donationAmount !== null &&
        Number.isFinite(donationAmount) &&
        donationAmount >= minDonationAmount &&
        donationAmount <= maxDonationAmount;
    const paymentStatus = searchParams.get('payment');

    const formatMoney = (amount: number): string =>
        new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency,
            minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(amount);

    const handlePresetAmountClick = (amount: number): void => {
        setSelectedAmount(amount);
        setCustomAmount('');
        setErrorMessage(null);
    };

    const handleCustomAmountChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        setCustomAmount(event.target.value);
        setSelectedAmount(null);
        setErrorMessage(null);
    };

    const handleDonate = async (): Promise<void> => {
        if (!amountIsValid || donationAmount === null) {
            setErrorMessage(
                `Choose an amount between ${minDonationAmount} and ${maxDonationAmount}.`,
            );
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await createDonationCheckoutSession({
                amountCents: Math.round(donationAmount * 100),
                successUrl: `${window.location.origin}/donate?payment=success`,
                cancelUrl: `${window.location.origin}/donate?payment=cancelled`,
            });

            window.location.assign(response.checkoutUrl);
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
            <Stack spacing={3}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2.5, md: 4 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(135deg, rgba(0, 200, 83, 0.14), transparent 46%)',
                            pointerEvents: 'none',
                        }}
                    />
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={3}
                        sx={{
                            position: 'relative',
                            alignItems: { md: 'center' },
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ maxWidth: 720 }}>
                            <Chip
                                icon={<VolunteerActivismOutlinedIcon />}
                                label="Support the project"
                                color="success"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h3" component="h1" gutterBottom>
                                Support TradeLayers
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Your contribution helps us keep improving the project and building
                                better tools for tracking market activity.
                            </Typography>
                        </Box>

                        <Paper
                            variant="outlined"
                            sx={{
                                width: { xs: '100%', md: 260 },
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                            }}
                        >
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Donations are processed through
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                    <CreditCardOutlinedIcon color="primary" />
                                    <Typography variant="h6">Stripe Checkout</Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Stack>
                </Paper>

                {paymentStatus === 'success' && (
                    <Alert severity="success">
                        Thank you for supporting TradeLayers. Your donation was completed.
                    </Alert>
                )}
                {paymentStatus === 'cancelled' && (
                    <Alert severity="info">Checkout was cancelled. No payment was taken.</Alert>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.15fr) 0.85fr' },
                        gap: 2,
                    }}
                >
                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Make a donation
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Choose a preset amount or enter a custom amount.
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(2, minmax(0, 1fr))',
                                        sm: 'repeat(4, minmax(0, 1fr))',
                                    },
                                    gap: 1,
                                }}
                            >
                                {presetAmounts.map((amount) => (
                                    <Button
                                        key={amount}
                                        variant={
                                            selectedAmount === amount && customAmount.trim() === ''
                                                ? 'contained'
                                                : 'outlined'
                                        }
                                        size="large"
                                        onClick={() => handlePresetAmountClick(amount)}
                                    >
                                        {formatMoney(amount)}
                                    </Button>
                                ))}
                            </Box>

                            <TextField
                                label="Custom amount"
                                value={customAmount}
                                type="number"
                                fullWidth
                                onChange={handleCustomAmountChange}
                                error={customAmount.trim() !== '' && !amountIsValid}
                                helperText={`Minimum ${formatMoney(minDonationAmount)}, maximum ${formatMoney(maxDonationAmount)}.`}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {currencySymbol}
                                            </InputAdornment>
                                        ),
                                    },
                                    htmlInput: {
                                        min: minDonationAmount,
                                        max: maxDonationAmount,
                                        step: 1,
                                    },
                                }}
                            />

                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1.5}
                                sx={{ alignItems: { sm: 'center' } }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={
                                        isSubmitting ? (
                                            <CircularProgress color="inherit" size={18} />
                                        ) : (
                                            <FavoriteBorderOutlinedIcon />
                                        )
                                    }
                                    disabled={!amountIsValid || isSubmitting}
                                    onClick={handleDonate}
                                >
                                    {amountIsValid && donationAmount !== null
                                        ? `Donate ${formatMoney(donationAmount)}`
                                        : 'Choose amount'}
                                </Button>
                                {donationUrl && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        href={donationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        endIcon={<OpenInNewOutlinedIcon />}
                                    >
                                        Open payment link
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Paper>

                    <Stack spacing={2}>
                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                    <VolunteerActivismOutlinedIcon color="success" />
                                    <Typography variant="h6" component="h2">
                                        What this supports
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Typography variant="body2" color="text.secondary">
                                    Donations help keep the project maintained while we continue
                                    improving stock tracking, watchlists, portfolio tools, and
                                    learning resources.
                                </Typography>
                            </Stack>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                    <SecurityOutlinedIcon color="primary" />
                                    <Typography variant="h6" component="h2">
                                        Secure checkout
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Typography variant="body2" color="text.secondary">
                                    Card details are entered on Stripe Checkout and are never stored
                                    by TradeLayers.
                                </Typography>
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default DonationPage;
