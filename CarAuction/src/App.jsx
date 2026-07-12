
import React from 'react'
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from './Components/ScrollToTop';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import HomePage from './Pages/HomePage';
import Footer from './Components/Footer';
import VehicleListingPage from './Pages/VehicleListingPage';
import VehicleDetailsPage from './Pages/VehicleDetailsPage';
import LiveAuctionDetail from './Components/LiveAuctionDetail';
import LiveAuctionsPage from './Pages/LiveAuctionsPage';
import LiveAuctionsDetailPage from './Pages/LiveAuctionsDetailPage';
import UpcomingAuctionsPage from './Pages/UpcomingAuctionsPage';
import UpcomingAuctionsDetailPage from './Pages/UpcomingAuctionsDetailPage';
import EndedAuctionsPage from './Pages/EndedAuctionsPage';
import EndedAuctionsDetailPage from './Pages/EndedAuctionsDetailPage';
import HowItWorkPage from './Pages/HowItWorkPage';
import AboutPage from './Pages/AboutPage';
import SellCarPage from './Pages/SellCarPage';
import ContactPage from './Pages/ContactPage';
import FAQsPage from './Pages/FAQsPage';
import RegisterSelection from './Components/RegisterSelection';
import MainLayout from './Layouts/MainLayout';
import AuthLayout from './Layouts/AuthLayout';
import BuyerRegistrationPage from './Pages/BuyerRegistrationPage';
import BuyerPanelPage from './Pages/BuyerPanelPage';
import LoginForm from './Components/LoginForm';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'sans-serif',
            fontSize: '14px',
          },
        }}
      />

      <Routes>
        
        {/* ============ user side ============= */}
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/vehicle-list' element={<VehicleListingPage />} />
          <Route path='/vehicle-detail/:id' element={<VehicleDetailsPage />} />

          <Route path='/live-auctions' element={<LiveAuctionsPage />} />
          <Route path='/live-auctions-detail/:id' element={<LiveAuctionsDetailPage />} />

          <Route path='/upcoming-auctions' element={<UpcomingAuctionsPage />} />
          <Route path='/upcoming-auctions-detail/:id' element={<UpcomingAuctionsDetailPage />} />

          <Route path='/ended-auctions' element={<EndedAuctionsPage />} />
          <Route path='/ended-auctions-detail/:id' element={<EndedAuctionsDetailPage />} />

          <Route path='/how-it-work' element={<HowItWorkPage />} />
          <Route path='/about-us' element={<AboutPage />} />
          <Route path='/sell-your-car' element={<SellCarPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/faq' element={<FAQsPage />} />

          <Route path='/signup' element={<RegisterSelection />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:id/:token' element={<ResetPassword />} />
        </Route>

        {/* ============ auth ============= */}
        <Route element={<AuthLayout />}>
          <Route path="/buyer-registration" element={<BuyerRegistrationPage />} />
          <Route path="/buyer-dashboard" element={<BuyerPanelPage />} />

        </Route>

      </Routes>

    </>
  )
}

export default App;