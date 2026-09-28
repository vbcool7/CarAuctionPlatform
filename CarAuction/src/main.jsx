
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './socket/SocketProvider';

const queryClient = new QueryClient();

const isProduction = import.meta.env.PROD;

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <SocketProvider>
            <BrowserRouter basename={isProduction ? "/CarAuction" : "/"}>
                <App />
            </BrowserRouter>
        </SocketProvider>
    </QueryClientProvider>
)
