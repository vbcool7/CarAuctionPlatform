
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, X } from 'lucide-react';
import { toast } from 'react-toastify';
import SellerSidebar from '../Components/SellerPanel/SellerSidebar';
import SellerNavbar from '../Components/SellerPanel/SellerNavbar';
import SellerDashboard from '../Components/SellerPanel/SellerDashboard/SellerDashboard';
import AddNewVehicle from '../Components/SellerPanel/AddNewVehicle/AddNewVehicle';
import MyVehicles from '../Components/SellerPanel/MyVehicles/MyVehicles';
import MyVehiclesDetail from '../Components/SellerPanel/MyVehicles/MyVehiclesDetail';
import MyAuctions from '../Components/SellerPanel/MyAuctions/MyAuctions';
import MyAuctionsDetail from '../Components/SellerPanel/MyAuctions/MyAuctionsDetail';
import BidsOffers from '../Components/SellerPanel/BidsOffers/BidsOffers';
import BidsOffersDetail from '../Components/SellerPanel/BidsOffers/BidsOffersDetail';
import SalesHistory from '../Components/SellerPanel/SalesHistory/SalesHistory';
import SalesHistoryDetail from '../Components/SellerPanel/SalesHistory/SalesHistoryDetail';
import Payouts from '../Components/SellerPanel/Payouts/Payouts';
import PayoutDetails from '../Components/SellerPanel/Payouts/PayoutDetails';

import { useSellerLogout } from '../hook/useSeller';
import useAuthStore from '../store/useAuthStore';

function SellerPanelPage() {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('bids-offers');
  const [previousPage, setPreviousPage] = useState(null);
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutate: logoutSeller, isPending: isLoggingOut } = useSellerLogout();
  const clearStore = useAuthStore((state) => state.logout);

  const [selectedMyVehicleId, setSelectedMyVehicleId] = useState();
  const [selectedAuctionId, setSelectedAuctionId] = useState();
  const [selectedBidsOfferId, setSelectedBidsOfferId] = useState();
  const [selectedSalesId, setSelectedSalesId] = useState();
  const [selectedPayoutId, setSelectedPayoutId] = useState();

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSideBarCollapsed((prev) => !prev)
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
  };

  // logout
  const handleLogout = () => {
    logoutSeller(null, {
      onSuccess: (res) => {
        clearStore();
        navigate('/login');
        toast.success(res.message || "Logout successful!");
      },
      onError: (err) => {
        clearStore();
        navigate('/login');
        toast.error(err.response?.data?.message || "Logout failed, but you've been signed out locally");
      }
    })
  }

  return (
    <div className='min-h-screen bg-slate-50 transition-all duration-500'>
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* sidebar call */}
      <div className='flex h-screen overflow-hidden'>
        <SellerSidebar
          collapsed={sideBarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onToggle={handleToggleSidebar}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          openLogoutModal={() => setIsLogoutModalOpen(true)}
        />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <SellerNavbar
            setCurrentPage={setCurrentPage}
            sidebarCollapsed={sideBarCollapsed}
            onToggleSideBar={handleToggleSidebar}
          />

          <main className='flex overflow-y-auto bg-transparent'>
            <div className='p-6 space-y-6 w-full'>

              {/* dashboard */}
              {currentPage === 'dashboard' && <SellerDashboard setCurrentPage={setCurrentPage} />}

              {/* add new vehicle */}
              {currentPage === 'add-new-vehicle' && <AddNewVehicle setCurrentPage={setCurrentPage} />}

              {/* my vehicles */}
              {currentPage === 'my-vehicles' && <MyVehicles setSelectedMyVehicleId={setSelectedMyVehicleId} setCurrentPage={setCurrentPage} />}
              {currentPage === 'my-vehicles-detail' && <MyVehiclesDetail myVehileId={selectedMyVehicleId} setCurrentPage={setCurrentPage} />}

              {/* my auctions */}
              {currentPage === 'my-auctions' && <MyAuctions setSelectedAuctionId={setSelectedAuctionId} setCurrentPage={setCurrentPage} />}
              {currentPage === 'my-auctions-detail' && <MyAuctionsDetail auctionId={selectedAuctionId} setCurrentPage={setCurrentPage} />}

              {/* bids offers */}
              {currentPage === 'bids-offers' && <BidsOffers setSelectedBidsOfferId={setSelectedBidsOfferId} setCurrentPage={setCurrentPage} />}
              {currentPage === 'bids-offers-detail' && <BidsOffersDetail bidsOfferId={selectedBidsOfferId} setCurrentPage={setCurrentPage} />}

              {/* sales history */}
              {currentPage === 'sales-history' && <SalesHistory setSelectedSalesId={setSelectedSalesId} setCurrentPage={setCurrentPage} />}
              {currentPage === 'sales-history-detail' && <SalesHistoryDetail salesId={selectedSalesId} setCurrentPage={setCurrentPage} />}

              {/* payout */}
              {currentPage === 'payouts' && <Payouts setSelectedPayoutId={setSelectedPayoutId} setCurrentPage={setCurrentPage} />}
              {currentPage === 'payouts-detail' && <PayoutDetails payoutId={selectedPayoutId} setCurrentPage={setCurrentPage} />}

              {/* logout */}
              {isLogoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
                  <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                    <div className="h-1.5 w-full bg-[#D97706]" />

                    <button
                      type="button"
                      onClick={() => setIsLogoutModalOpen(false)}
                      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="px-6 pb-6 pt-8">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-8 ring-amber-50/50">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D97706] shadow-md shadow-amber-200">
                          <LogOut className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mt-6 text-center">
                        <h2 className="text-xl font-bold text-slate-900">
                          Logout from Seller Account?
                        </h2>

                        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                          Are you sure you want to logout? You'll need to sign in
                          again to access your seller dashboard.
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="mt-7 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setIsLogoutModalOpen(false)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={isLoggingOut}
                          onClick={handleLogout}
                          className={`rounded-xl bg-[#D97706] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-amber-200 transition-all ${isLoggingOut
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-pointer hover:bg-[#B45309] hover:shadow-md active:scale-[0.98]"
                            }`}
                        >
                          Logout
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Your account remains secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default SellerPanelPage;