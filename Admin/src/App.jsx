
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
import CancelledAuctions from './Components/AuctionManagement/CancelledAuctions/CancelledAuctions';
import CancelledAuctionsDetail from './Components/AuctionManagement/CancelledAuctions/CancelledAuctionsDetail';
import CompletedAuctions from './Components/AuctionManagement/CompletedAuctions/CompletedAuctions';
import CompletedAuctionsDetail from './Components/AuctionManagement/CompletedAuctions/CompletedAuctionsDetail';
import BidManagement from './Components/BidManagement/BidManagement';
import Payouts from './Components/PayoutManagement/Payouts/Payouts';
import CreatePayoutForm from './Components/PayoutManagement/Payouts/CreatePayoutForm';
import AllPayments from './Components/PayoutManagement/AllPayments/AllPayments';
import AllPaymentsDetail from './Components/PayoutManagement/AllPayments/AllPaymentsDetail';
import Refunds from './Components/PayoutManagement/Refunds/Refunds';
import Transactions from './Components/PayoutManagement/Transactions/Transactions';
import PaymentGateway from './Components/PayoutManagement/PaymentGateway/PaymentGateway';
import AddNewPaymentGatewayForm from './Components/PayoutManagement/PaymentGateway/AddNewPaymentGatewayForm';
import PaymentGatewayDetails from './Components/PayoutManagement/PaymentGateway/PaymentGatewayDetails';
import AllDisputes from './Components/DisputeManagement/AllDisputes/AllDisputes';
import DisputeCategories from './Components/DisputeManagement/DisputeCategories/DisputeCategories';
import AddNewCategory from './Components/DisputeManagement/DisputeCategories/AddNewCategory';
import EditDisputeCategory from './Components/DisputeManagement/DisputeCategories/EditDisputeCategory';
import AllDisputesDetail from './Components/DisputeManagement/AllDisputes/AllDisputesDetail';
import EditAllDisputes from './Components/DisputeManagement/AllDisputes/EditAllDisputes';
import ReportAndAnalytics from './Components/ReportAndAnalytics/ReportAndAnalytics';
import CreateCustomPage from './Components/CmsManagement/CreateCustomPage';
import CreateBlogPost from './Components/CmsManagement/CreateBlogPost';
import AllPages from './Components/CmsManagement/AllPages';
import BlogList from './Components/CmsManagement/BlogList';
import SystemSetting from './Components/SystemSetting/SystemSetting';
import AdvancedFeatures from './Components/AdvancedFeatures/AdvancedFeatures';
import PayoutsDetail from './Components/PayoutManagement/Payouts/PayoutsDetail';
import RefundsDetail from './Components/PayoutManagement/Refunds/RefundsDetail';
import TransactionsDetail from './Components/PayoutManagement/Transactions/TransactionsDetail';
import SellerVehicleDetail from './Components/UserManagement/SellerVehicleDetail';
import BuyerKycVerification from './Components/KycVerification/BuyerKycVerification';
import SellerKycVerification from './Components/KycVerification/SellerKycVerification';
import BuyerKycVerificationDetail from './Components/KycVerification/BuyerKycVerificationDetail';
import SellerKycVerificationDetail from './Components/KycVerification/SellerKycVerificationDetail';
import VehicleApprovalsDetail from './Components/VehicleApprovals/VehicleApprovalsDetail';

function App() {

  const token = useAdminAuthStore((state) => state.token);

  const [currentPage, setCurrentPage] = useState('vehicle-approvals');
  const [previousPage, setPreviousPage] = useState(null);
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // buyer-seller-staff
  const [selectedBuyerId, setSelectedBuyerId] = useState(null);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // vehicle approvals
  const [selectedVehicleAppId, setSelectedVehicleAppId] = useState(null);

  // auct management
  const [selectedAuction, setSelectedAuction] = useState(null);

  // pay man - create payout
  const [payoutDraft, setPayoutDraft] = useState({});
  const [payoutStep, setPayoutStep] = useState(1);

  // pay management 
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedPayoutId, setSelectedPayoutId] = useState(null);
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedGatewayId, setSelectedGatewayId] = useState(null);

  // dis man
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedAllDisputeId, setSelectedAllDisputeId] = useState(null);

  // cms man
  const [editingBlog, setEditingBlog] = useState(null);

  // kyc
  const [selectedBuyerKycId, setSelectedBuyerKycId] = useState(null);
  const [selectedSellerKycId, setSelectedSellerKycId] = useState(null);

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
    setSelectedBuyerId(buyer._id);
    setCurrentPage('buyer-detail');
  };

  // user mang - seller detail
  const handleViewSeller = (seller) => {
    setSelectedSellerId(seller._id);
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
                {currentPage === 'buyer-detail' && <BuyerDetail buyerId={selectedBuyerId} setCurrentPage={setCurrentPage} />}

                {currentPage === 'sellers' && <Seller onViewSeller={handleViewSeller} setCurrentPage={setCurrentPage} />}
                {currentPage === 'seller-detail' && <SellerDetail sellerId={selectedSellerId} setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'seller-vehicle-detail' && <SellerVehicleDetail vehicleId={selectedVehicleId} setCurrentPage={setCurrentPage} />}

                {currentPage === 'staffs' && <Staff onViewStaff={handleViewStaff} setCurrentPage={setCurrentPage} />}
                {currentPage === 'staff-detail' && <StaffDetail staff={selectedStaff} setCurrentPage={setCurrentPage} />}

                {/* user management - form : buyer, seller, staff */}
                {currentPage === 'add-new-buyer' && <AddNewBuyerForm setCurrentPage={setCurrentPage} />}
                {currentPage === 'add-new-seller' && <AddNewSellerForm setCurrentPage={setCurrentPage} />}
                {currentPage === 'add-new-staff' && <AddNewStaffForm setCurrentPage={setCurrentPage} />}

                {/* vehicle approval */}
                {currentPage === 'vehicle-approvals' && <VehicleApprovals setSelectedVehicleAppId={setSelectedVehicleAppId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'vehicle-approvals-detail' && <VehicleApprovalsDetail vehicleAppId={selectedVehicleAppId} setCurrentPage={setCurrentPage} />}

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

                {/* auc man - cancelled */}
                {currentPage === 'cancelled-auctions' &&
                  <CancelledAuctions
                    setCurrentPage={setCurrentPage}
                    onSelectVehicle={(auction) => {
                      setSelectedAuction(auction);
                      setCurrentPage('cancelled-auction-detail');
                    }}
                  />
                }
                {currentPage === 'cancelled-auction-detail' && (
                  <CancelledAuctionsDetail setCurrentPage={setCurrentPage} auction={selectedAuction} />
                )}

                {/* auc man - completed */}
                {currentPage === 'completed-auctions' &&
                  <CompletedAuctions
                    setCurrentPage={setCurrentPage}
                    onSelectVehicle={(auction) => {
                      setSelectedAuction(auction);
                      setCurrentPage('completed-auction-detail');
                    }}
                  />
                }
                {currentPage === 'completed-auction-detail' && (
                  <CompletedAuctionsDetail setCurrentPage={setCurrentPage} auction={selectedAuction} />
                )}

                {/* bid management */}
                {currentPage === 'bid-management' && <BidManagement setCurrentPage={setCurrentPage} />}

                {/* payout management - all payments */}
                {currentPage === 'all-payments' &&
                  <AllPayments
                    setCurrentPage={setCurrentPage}
                    setSelectedPaymentId={setSelectedPaymentId}
                  />
                }
                {currentPage === 'all-payments-detail' &&
                  <AllPaymentsDetail
                    setCurrentPage={setCurrentPage}
                    paymentId={selectedPaymentId}
                  />
                }

                {/* payout management - payouts */}
                {currentPage === 'payouts' && <Payouts setSelectedPayoutId={setSelectedPayoutId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'payouts-detail' && <PayoutsDetail payoutId={selectedPayoutId} setCurrentPage={setCurrentPage} />}

                {/* payout management - create payout */}
                {currentPage === 'create-payout' &&
                  <CreatePayoutForm
                    setCurrentPage={setCurrentPage}
                    payoutDraft={payoutDraft}
                    setPayoutDraft={setPayoutDraft}
                    payoutStep={payoutStep}
                    setPayoutStep={setPayoutStep}
                  />
                }

                {/* payout management - refunds */}
                {currentPage === 'refunds' && <Refunds setSelectedRefundId={setSelectedRefundId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'refunds-detail' && <RefundsDetail refundId={selectedRefundId} setCurrentPage={setCurrentPage} />}

                {/* payout management - transactions */}
                {currentPage === 'transactions' && <Transactions setSelectedTransactionId={setSelectedTransactionId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'transactions-detail' && <TransactionsDetail transactionId={selectedTransactionId} setCurrentPage={setCurrentPage} />}

                {/* payout management - pay gateway */}
                {currentPage === 'payment-gateways' &&
                  <PaymentGateway setSelectedGatewayId={setSelectedGatewayId} setCurrentPage={setCurrentPage} />}

                {currentPage === 'payment-gateways-detail' &&
                  <PaymentGatewayDetails
                    setCurrentPage={setCurrentPage}
                    gatewayId={selectedGatewayId}
                  />
                }

                {/* payout management - add new gateway */}
                {currentPage === 'add-new-payment-gateway' &&
                  <AddNewPaymentGatewayForm
                    setCurrentPage={setCurrentPage}
                  />
                }

                {/* dispute management - all dispute */}
                {currentPage === 'all-disputes' && <AllDisputes setSelectedAllDisputeId={setSelectedAllDisputeId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'all-disputes-detail' &&
                  <AllDisputesDetail
                    allDisputeId={selectedAllDisputeId}
                    setCurrentPage={setCurrentPage}
                  />
                }
                {currentPage === 'edit-all-dispute' &&
                  <EditAllDisputes
                    allDisputeId={selectedAllDisputeId}
                    setCurrentPage={setCurrentPage}
                  />
                }

                {/* dispute management - dispute cat */}
                {currentPage === 'dispute-categories' && <DisputeCategories setSelectedCategoryId={setSelectedCategoryId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'add-new-category' && <AddNewCategory setCurrentPage={setCurrentPage} />}
                {currentPage === 'edit-dispute-category' && <EditDisputeCategory categoryId={selectedCategoryId} setCurrentPage={setCurrentPage} />}

                {/* report & analytics */}
                {currentPage === 'reports-analytics' && <ReportAndAnalytics setCurrentPage={setCurrentPage} />}

                {/* cms management */}
                {currentPage === 'all-pages' && <AllPages setCurrentPage={setCurrentPage} />}
                {currentPage === 'create-custom-page' && <CreateCustomPage setCurrentPage={setCurrentPage} />}

                {currentPage === 'all-blogs' && <BlogList setCurrentPage={setCurrentPage} setEditingBlog={setEditingBlog} />}
                {currentPage === 'create-blog-post' && <CreateBlogPost key="new" setCurrentPage={setCurrentPage} />}
                {currentPage === 'edit-blog-post' && (
                  <CreateBlogPost setCurrentPage={setCurrentPage} initialData={editingBlog} key={editingBlog?.id} />
                )}

                {/* kyc verification */}
                {currentPage === 'buyer-kyc' && <BuyerKycVerification setSelectedBuyerKycId={setSelectedBuyerKycId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'buyer-kyc-detail' && <BuyerKycVerificationDetail buyerKycId={selectedBuyerKycId} setCurrentPage={setCurrentPage}/>}

                {currentPage === 'seller-kyc' && <SellerKycVerification setSelectedSellerKycId={setSelectedSellerKycId} setCurrentPage={setCurrentPage} />}
                {currentPage === 'seller-kyc-detail' && <SellerKycVerificationDetail sellerKycId={selectedSellerKycId} setCurrentPage={setCurrentPage}/>}

                {/* system setting */}
                {currentPage === 'system-settings' && <SystemSetting setCurrentPage={setCurrentPage} />}

                {/* advance feature */}
                {currentPage === 'ai-features' && <AdvancedFeatures setCurrentPage={setCurrentPage} />}

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