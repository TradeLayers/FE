import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton, Tooltip, type SxProps, type Theme } from '@mui/material';

import { useThemeMode } from '@styles/ThemeModeContext';

const ThemeToggleButtonSx: SxProps<Theme> = {
    width: 48,
    height: 48,
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    backgroundColor: 'background.paper',
    '&:hover': {
        backgroundColor: 'action.hover',
        borderColor: 'primary.main',
    },
};

const ThemeToggleButton: React.FC = () => {
    const { mode, toggleMode } = useThemeMode();
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    const isLightMode = mode === 'light';
    const ModeIcon = isLightMode ? LightModeOutlinedIcon : DarkModeOutlinedIcon;

    return (
        <Tooltip title={`Switch to ${nextMode} mode`}>
            <IconButton
                size="large"
                sx={{
                    ...ThemeToggleButtonSx,
                    color: isLightMode ? 'warning.main' : 'primary.main',
                }}
                aria-label={`${mode} mode active. Switch to ${nextMode} mode`}
                aria-pressed={isLightMode}
                onClick={toggleMode}
            >
                <ModeIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggleButton;
