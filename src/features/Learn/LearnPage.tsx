import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

const LearnPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Instructions
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                This will go over the main features of the app and how to use them.
            </Typography>
            <List dense>
                <ListItem disablePadding>
                    <ListItemText
                        primary="User account creation"
                        secondary="To create an account, click the 'Login' button in the top right corner and follow the prompts to sign up using your email and password."
                    />
                </ListItem>
            </List>
        </Box>
    );
};

export default LearnPage;
