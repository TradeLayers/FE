import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import { Provider } from 'react-redux';
import store from './store/store.ts';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider, CssBaseline } from '@mui/material';
import MainTheme from './styles/theme.ts';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={MainTheme}>
          <CssBaseline/>
        <App />
        </ThemeProvider>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>,
);
