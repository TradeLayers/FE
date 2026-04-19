import { createContext, useContext } from 'react';

import { type MainThemeMode } from './theme';

type ThemeModeContextValue = {
    mode: MainThemeMode;
    toggleMode: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const useThemeMode = (): ThemeModeContextValue => {
    const context = useContext(ThemeModeContext);

    if (!context) {
        throw new Error('useThemeMode must be used within ThemeModeContext.Provider');
    }

    return context;
};
