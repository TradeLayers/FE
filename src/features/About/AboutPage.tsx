import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Avatar, Box, Chip, Paper, Stack, Typography } from '@mui/material';

const contributors = ['Matas Brazauskas', 'Steponas Kaminskas', 'Titas Aleškevičius'];

const getInitials = (name: string): string =>
    name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2);

const AboutPage: React.FC = () => {
    return (
        <Box sx={{ maxWidth: 1080, mx: 'auto' }}>
            <Stack spacing={3}>
                <Paper
                    variant="outlined"
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        p: { xs: 2.5, md: 4 },
                        borderRadius: 2,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(135deg, rgba(0, 184, 212, 0.16), transparent 44%)',
                            pointerEvents: 'none',
                        }}
                    />
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={3}
                        sx={{ position: 'relative', alignItems: { md: 'center' } }}
                    >
                        <Box sx={{ flex: 1, maxWidth: 720 }}>
                            <Chip
                                icon={<TrendingUpOutlinedIcon />}
                                label="Stock tracking project"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h3" component="h1" gutterBottom>
                                About TradeLayers
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                TradeLayers is a student-driven project that simulates a stock
                                tracking platform with no risks or fees. We are passionate about
                                creating tools that empower users to stay informed and make smarter
                                decisions in the financial markets.
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                We are building tools that help users monitor stocks, understand
                                trends, and make informed decisions.
                            </Typography>
                        </Box>

                        <Paper
                            variant="outlined"
                            sx={{
                                width: { xs: '100%', md: 280 },
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                borderColor: 'divider',
                            }}
                        >
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                        }}
                                    >
                                        <SchoolOutlinedIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1">KTU students</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Kaunas University of Technology
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'success.main',
                                            color: 'success.contrastText',
                                        }}
                                    >
                                        <Groups2OutlinedIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {contributors.length} contributors
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Building the project together
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Paper>

                <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Contributors
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Our team consists of students from Kaunas University of Technology.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(3, minmax(0, 1fr))',
                        },
                        gap: 2,
                    }}
                >
                    {contributors.map((person, index) => (
                        <Paper
                            key={person}
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                minHeight: 176,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderRadius: 2,
                                borderColor: 'divider',
                                transition:
                                    'border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) =>
                                        `0 14px 34px ${theme.palette.action.hover}`,
                                },
                            }}
                        >
                            <Stack spacing={2}>
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        fontWeight: 700,
                                        bgcolor:
                                            index % 2 === 0 ? 'primary.main' : 'secondary.main',
                                        color:
                                            index % 2 === 0
                                                ? 'primary.contrastText'
                                                : 'secondary.contrastText',
                                    }}
                                >
                                    {getInitials(person)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" component="h3">
                                        {person}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Project contributor
                                    </Typography>
                                </Box>
                            </Stack>
                            <Chip
                                size="small"
                                label="KTU student"
                                variant="outlined"
                                sx={{ mt: 2, alignSelf: 'flex-start' }}
                            />
                        </Paper>
                    ))}
                </Box>
            </Stack>
        </Box>
    );
};

export default AboutPage;
