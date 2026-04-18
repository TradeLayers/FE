import { StrictMode, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { Provider, useDispatch, useSelector } from 'react-redux';

import store from '@store/store.ts';
import { addUserInfo } from '@store/userSlice';
import { auth } from '@configs/firebase';
import { createOrFetchUser } from '@api/userApi';
import { isGuest } from '@models/userTypes';
import { type RootState } from '@store/store';

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
const AccountPage = lazy(() => import('./features/Account/AccountPage.tsx'));
const StocksPage = lazy(() => import('./features/Stocks/StocksPage.tsx'));
const ComparePage = lazy(() => import('./features/Compare/ComparePage.tsx'));

const RequireUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isLoggedIn = useSelector((state: RootState) => !isGuest(state.userSliceName));

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function AuthListener(): null {
    const dispatch = useDispatch();
    useEffect(() => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) return;

            const token = await firebaseUser.getIdToken();
            dispatch(
                addUserInfo({
                    name: firebaseUser.displayName || firebaseUser.email || 'User',
                    firebaseId: token,
                    email: firebaseUser.email || undefined,
                }),
            );

            try {
                const dbUser = await createOrFetchUser();
                dispatch(addUserInfo(dbUser));
            } catch {
                // swallow: already have the auth-only user info in the store
            }
        });
    }, [dispatch]);
    return null;
}

function Main(): React.JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="learn" element={<LearnPage />} />
                    <Route path="stocks" element={<StocksPage />} />
                    <Route
                        path="compare"
                        element={
                            <RequireUser>
                                <ComparePage />
                            </RequireUser>
                        }
                    />
                    <Route
                        path="account"
                        element={
                            <RequireUser>
                                <AccountPage />
                            </RequireUser>
                        }
                    />
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
                    <AuthListener />
                    <Main />
                </ThemeProvider>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>,
);
