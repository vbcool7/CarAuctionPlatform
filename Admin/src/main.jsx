
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const isProduction = import.meta.env.PROD;

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={isProduction ? "/CarAuctionAdmin" : "/"}>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
)