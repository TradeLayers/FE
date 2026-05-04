import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton } from '@mui/material';

import { useThemeMode } from '@styles/ThemeModeContext';

const ThemeToggleButton: React.FC = () => {
    const { toggleMode } = useThemeMode();

    return (
        <IconButton onClick={toggleMode} aria-label="Toggle theme" size="small" sx={{ ml: 1 }}>
            <LightModeOutlinedIcon fontSize="small" />
        </IconButton>
    );
};

export default ThemeToggleButton;
