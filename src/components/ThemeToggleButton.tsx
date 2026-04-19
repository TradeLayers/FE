import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Button, type SxProps, type Theme } from '@mui/material';

import { useThemeMode } from '@styles/ThemeModeContext';

const ThemeToggleButtonSx: SxProps<Theme> = {
    minWidth: 136,
    whiteSpace: 'nowrap',
    backgroundColor: 'background.paper',
};

const ThemeToggleButton: React.FC = () => {
    const { mode, toggleMode } = useThemeMode();
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    const ModeIcon = nextMode === 'light' ? LightModeOutlinedIcon : DarkModeOutlinedIcon;

    return (
        <Button
            variant="outlined"
            size="large"
            sx={ThemeToggleButtonSx}
            startIcon={<ModeIcon fontSize="small" />}
            aria-label={`Switch to ${nextMode} mode`}
            aria-pressed={mode === 'light'}
            onClick={toggleMode}
        >
            {nextMode === 'light' ? 'Light Mode' : 'Dark Mode'}
        </Button>
    );
};

export default ThemeToggleButton;
