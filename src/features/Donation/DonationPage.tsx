import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';

const DonationPage: React.FC = () => {
    const donationUrl = import.meta.env.VITE_DONATION_URL as string | undefined;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Support TradeLayers
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Your contribution helps us keep improving the project and building better tools for
                tracking market activity.
            </Typography>

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    maxWidth: 560,
                    borderRadius: 2,
                }}
            >
                <Stack spacing={2}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <VolunteerActivismOutlinedIcon color="primary" />
                        <Typography variant="h6" component="h3">
                            Make a donation
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        Donations are handled through our external payment link.
                    </Typography>

                    {!donationUrl && (
                        <Typography variant="body2" color="warning.main">
                            Donation link is not configured yet.
                        </Typography>
                    )}

                    <Box>
                        {donationUrl ? (
                            <Button
                                variant="contained"
                                size="large"
                                href={donationUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Donate
                            </Button>
                        ) : (
                            <Button variant="contained" size="large" disabled>
                                Donate
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default DonationPage;
