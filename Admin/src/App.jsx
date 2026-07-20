
import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast';

import useAdminAuthStore from './store/useAdminAuthStore';

import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login';
import Logout from './Components/Logout';
import Buyer from './Components/UserManagement/Buyer';
import Seller from './Components/UserManagement/Seller';
import Staff from './Components/UserManagement/Staff';
import AddNewBuyerForm from './Components/UserManagement/AddNewUser/AddNewBuyerForm';
import AddNewSellerForm from './Components/UserManagement/AddNewUser/AddNewSellerForm';
import AddNewStaffForm from './Components/UserManagement/AddNewUser/AddNewStaffForm';
import BuyerDetail from './Components/UserManagement/BuyerDetail';
import SellerDetail from './Components/UserManagement/SellerDetail';
import StaffDetail from './Components/UserManagement/StaffDetail';
import VehicleApprovals from './Components/VehicleApprovals/VehicleApprovals';
import AllAuctions from './Components/AuctionManagement/AllAuctions/AllAuctions';
import LiveAuctions from './Components/AuctionManagement/LiveAuctions/LiveAuctions';
import LiveAuctionsDetail from './Components/AuctionManagement/LiveAuctions/LiveAuctionsDetail';
import UpcomingAuctions from './Components/AuctionManagement/UpcomingAuctions/UpcomingAuctions';
import UpcomingAuctionsDetail from './Components/AuctionManagement/UpcomingAuctions/UpcomingAuctionsDetail';

function App() {

  const token = useAdminAuthStore((state) => state.token);

  const [currentPage, setCurrentPage] = useState("upcoming-auctions");
  const [previousPage, setPreviousPage] = useState(null);
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // buyer-seller-staff
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // auct management
  const [selectedAuction, setSelectedAuction] = useState(null);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSideBarCollapsed((prev) => !prev);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
  };

  // Global Toaster 
  const globalToaster = (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: 'sans-serif',
          fontSize: '14px',
          zIndex: 9999,
        },
      }}
    />
  );

  // if not token show only login
  if (!token) {
    return (
      <>
        {globalToaster}
        <Login />
      </>
    )
  }

  // user mang - buyer detail
  const handleViewBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setCurrentPage('buyer-detail');
  };

  // user mang - seller detail
  const handleViewSeller = (seller) => {
    setSelectedSeller(seller);
    setCurrentPage('seller-detail');
  };

  // user mang - staff detail
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setCurrentPage('staff-detail');
  };

  return (
    <>
      {globalToaster}

      <div className='min-h-screen bg-white transition-all duration-500'>

        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        {/* sidebar call */}
        <div className='flex h-screen overflow-hidden'>
          <Sidebar
            collapsed={sideBarCollapsed}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onToggle={handleToggleSidebar}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            openLogoutModal={() => setIsLogoutModalOpen(true)}
          />

          {/* header call */}
          <div className='flex-1 flex flex-col overflow-hidden'>
            <Header
              setCurrentPage={setCurrentPage}
              sidebarCollapsed={sideBarCollapsed}
              onToggleSideBar={handleToggleSidebar}
            />

            <main className='flex overflow-y-auto bg-transparent'>
              <div className='p-6 space-y-6 w-full'>

                {/* dashboard */}
                {currentPage === "dashboard" && <Dashboard setCurrentPage={setCurrentPage} />}

                {/* user management */}
                {currentPage === 'buyers' && <Buyer onViewBuyer={handleViewBuyer} setCurrentPage={setCurrentPage} />}
                {currentPage === 'sellers' && <Seller onViewSeller={handleViewSeller} setCurrentPage={setCurrentPage} />}
                {currentPage === 'staffs' && <Staff onViewStaff={handleViewStaff} setCurrentPage={setCurrentPage} />}

                {/* user management - detail page : buyer, seller, staff */}
                {currentPage === 'buyer-detail' && <BuyerDetail buyer={selectedBuyer} setCurrentPage={setCurrentPage} />}
                {currentPage === 'seller-detail' && <SellerDetail seller={selectedSeller} setCurrentPage={setCurrentPage} />}
                {currentPage === 'staff-detail' && <StaffDetail staff={selectedStaff} setCurrentPage={setCurrentPage} />}

                {/* user management - form : buyer, seller, staff */}
                {currentPage === 'add-new-buyer' && <AddNewBuyerForm setCurrentPage={setCurrentPage} />}
                {currentPage === 'add-new-seller' && <AddNewSellerForm setCurrentPage={setCurrentPage} />}
                {currentPage === 'add-new-staff' && <AddNewStaffForm setCurrentPage={setCurrentPage} />}

                {/* vehicle approval */}
                {currentPage === 'vehicle-approvals' && <VehicleApprovals setCurrentPage={setCurrentPage} />}

                {/* auction management */}
                {currentPage === 'all-auctions' && <AllAuctions setCurrentPage={setCurrentPage} setSelectedAuction={setSelectedAuction} />}

                {/* auc man - live */}
                {currentPage === 'live-auctions' &&
                  <LiveAuctions
                    setCurrentPage={setCurrentPage}
                    onSelectVehicle={(auction) => {
                      setSelectedAuction(auction);
                      setCurrentPage('live-auction-detail');
                    }}
                  />
                }
                {currentPage === 'live-auction-detail' && (
                  <LiveAuctionsDetail setCurrentPage={setCurrentPage} auction={selectedAuction} />
                )}

                {/* auc man - upcoming */}
                {currentPage === 'upcoming-auctions' &&
                  <UpcomingAuctions
                    setCurrentPage={setCurrentPage}
                    onSelectVehicle={(auction) => {
                      setSelectedAuction(auction);
                      setCurrentPage('upcoming-auction-detail');
                    }}
                  />
                }
                {currentPage === 'upcoming-auction-detail' && (
                  <UpcomingAuctionsDetail setCurrentPage={setCurrentPage} auction={selectedAuction} />
                )}

                {/* logout */}
                {isLogoutModalOpen && (
                  <Logout onClose={() => setIsLogoutModalOpen(false)} />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;