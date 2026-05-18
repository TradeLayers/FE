import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { useThemeMode } from '@styles/ThemeModeContext';

const ThemeToggleButton: React.FC = () => {
    const { mode, toggleMode } = useThemeMode();

    return (
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
                onClick={toggleMode}
                aria-label="Toggle theme"
                size="small"
                sx={{
                    width: 40,
                    height: 40,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    color: 'text.secondary',
                    bgcolor: 'action.hover',
                    flexShrink: 0,
                    '&:hover': {
                        color: 'text.primary',
                        bgcolor: 'action.selected',
                    },
                }}
                data-testid="theme-toggle"
            >
                {mode === 'dark' ? (
                    <LightModeOutlinedIcon fontSize="small" />
                ) : (
                    <DarkModeOutlinedIcon fontSize="small" />
                )}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggleButton;
