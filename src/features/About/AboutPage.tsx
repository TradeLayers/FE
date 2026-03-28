import { Avatar, Box, Paper, Stack, Typography } from '@mui/material';

const contributors = [
    'Matas Brazauskas',
    'Steponas Kaminskas',
    'Titas Aleškevičius',
];

const getInitials = (name: string): string =>
    name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2);

const AboutPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                About Us
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                TradeLayers is a student-driven project that simulates a stock tracking platform
                with no risks or fees. We are passionate about creating tools that empower users to
                stay informed and make smarter decisions in the financial markets.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                We are building tools that help users monitor stocks, understand trends, and make
                informed decisions.
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Our team consists of students from Kaunas University of Technology:
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 2, maxWidth: 720 }}>
                {contributors.map((person) => (
                    <Paper
                        key={person}
                        variant="outlined"
                        sx={{
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            borderRadius: 2,
                        }}
                    >
                        <Avatar sx={{ width: 36, height: 36 }}>{getInitials(person)}</Avatar>
                        <Box>
                            <Typography variant="subtitle1" sx={{ lineHeight: 1.2 }}>
                                {person}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Project contributor
                            </Typography>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
};

export default AboutPage;
