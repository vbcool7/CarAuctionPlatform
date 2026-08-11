
import React from 'react'
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from './Components/ScrollToTop';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import HomePage from './Pages/HomePage';
import Footer from './Components/Footer';
import VehicleListingPage from './Pages/VehicleListingPage';
import VehicleDetail from './Components/VehicleDetail';
import LiveAuctions from './Components/LiveAuctions';
import LiveAuctionsDetail from './Components/LiveAuctionsDetail';
import UpcomingAuctions from './Components/UpcomingAuctions';
import UpcomingAuctionsDetail from './Components/UpcomingAuctionsDetail';
import EndedAuctions from './Components/EndedAuctions';
import EndedAuctionsDetail from './Components/EndedAuctionsDetail';
import RegisterSelection from './Components/RegisterSelection';
import MainLayout from './Layouts/MainLayout';
import AuthLayout from './Layouts/AuthLayout';
import LoginForm from './Components/LoginForm';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import AboutUs from './Components/AboutUs';
import HowItWorks from './Components/HowItWorks';
import SellYourCar from './Components/SellYourCar';
import FAQs from './Components/FAQs';
import ContactUs from './Components/ContactUs';
import BuyerRegistrationPage from './Pages/BuyerRegistrationPage';
import SellerRegistration from './Components/SellerRegistration/SellerRegistration';
import BuyerPanelPage from './Pages/BuyerPanelPage';
import SellerPanelPage from './Pages/SellerPanelPage';

function App() {
  return (
    <>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        toastStyle={{
          borderRadius: "14px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          fontSize: "14px",
          color: "#0B1E3D",
        }}
      />

      <Routes>

        {/* ============ user side ============= */}
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/vehicle-list' element={<VehicleListingPage />} />
          <Route path='/vehicle-detail/:id' element={<VehicleDetail />} />

          <Route path='/live-auctions' element={<LiveAuctions />} />
          <Route path='/live-auctions-detail/:id' element={<LiveAuctionsDetail />} />

          <Route path='/upcoming-auctions' element={<UpcomingAuctions />} />
          <Route path='/upcoming-auctions-detail/:id' element={<UpcomingAuctionsDetail />} />

          <Route path='/ended-auctions' element={<EndedAuctions />} />
          <Route path='/ended-auctions-detail/:id' element={<EndedAuctionsDetail />} />

          <Route path='/how-it-work' element={<HowItWorks />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/sell-your-car' element={<SellYourCar />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/faq' element={<FAQs />} />

          <Route path='/signup' element={<RegisterSelection />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:id/:token' element={<ResetPassword />} />
        </Route>

        {/* ============ auth ============= */}
        <Route element={<AuthLayout />}>
          <Route path="/buyer-registration" element={<BuyerRegistrationPage />} />
          <Route path="/buyer-dashboard" element={<BuyerPanelPage />} />

          <Route path='/seller-registration' element={<SellerRegistration />} />
          <Route path="/seller-dashboard" element={<SellerPanelPage />} />

        </Route>

      </Routes>

    </>
  )
}

export default App;