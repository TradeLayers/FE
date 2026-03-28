import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from '@store/store.ts';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider, CssBaseline } from '@mui/material';
import MainTheme from './styles/theme.ts';

const queryClient = new QueryClient();

const MainPage = lazy(() => import('./MainPage.tsx'));
const LoginPage = lazy(() => import('./features/Login/LoginPage.tsx'));
const HomePage = lazy(() => import('./features/Home/HomePage.tsx'));
const AboutPage = lazy(() => import('./features/About/AboutPage.tsx'));
const LearnPage = lazy(() => import('./features/Learn/LearnPage.tsx'));

function Main(): React.JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="learn" element={<LearnPage />} />
                    <Route path="*" element={<HomePage />} />
                </Route>
                <Route path="login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <ThemeProvider theme={MainTheme}>
                    <CssBaseline />
                    <Main />
                </ThemeProvider>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>,
);
