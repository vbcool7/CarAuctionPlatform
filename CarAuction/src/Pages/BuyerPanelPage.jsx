
import React, { useState } from 'react';
import BuyerSidebar from '../Components/BuyerPanel/BuyerSidebar';
import BuyerNavbar from '../Components/BuyerPanel/BuyerNavbar';
import BuyerDashboard from '../Components/BuyerPanel/BuyerDashboard/BuyerDashboard';
import BuyerBrowseAuction from '../Components/BuyerPanel/BuyerBrowseAuctions/BuyerBrowseAuction';
import BuyerUpcomingAuctions from '../Components/BuyerPanel/BuyerUpcomingAuctions/BuyerUpcomingAuctions';
import BuyerLiveAuctions from '../Components/BuyerPanel/BuyerLiveAuctions/BuyerLiveAuctions';
import BuyerWatchlist from '../Components/BuyerPanel/BuyerWatchlist/BuyerWatchlist';
import BuyerMyBids from '../Components/BuyerPanel/BuyerMyBids/BuyerMyBids';
import BuyerWonAuctions from '../Components/BuyerPanel/BuyerWonAuctions/BuyerWonAuctions';
import BuyerWonAuctionsDetail from '../Components/BuyerPanel/BuyerWonAuctions/BuyerWonAuctionsDetail';
import BuyerLostAuctions from '../Components/BuyerPanel/BuyerLostAuctions/BuyerLostAuctions';
import BuyerMyOffers from '../Components/BuyerPanel/BuyerMyOffers/BuyerMyOffers';
import BuyerMyOffersDetail from '../Components/BuyerPanel/BuyerMyOffers/BuyerMyOffersDetail';
import BuyerPayments from '../Components/BuyerPanel/BuyerPayments/BuyerPayments';
import BuyerPaymentsDetail from '../Components/BuyerPanel/BuyerPayments/BuyerPaymentsDetail';
import BuyerInvoices from '../Components/BuyerPanel/BuyerInvoices/BuyerInvoices';
import BuyerProfile from '../Components/BuyerPanel/BuyerProfile/BuyerProfile';
import BuyerSupport from '../Components/BuyerPanel/BuyerSupport/BuyerSupport';
import SellerProfilePage from '../Components/BuyerPanel/BuyerSharedComponents/SellerProfilePage';
import SellerInventoryDetail from '../Components/BuyerPanel/BuyerSharedComponents/SellerInventoryDetail';
import BuyerLostAuctionsDetail from '../Components/BuyerPanel/BuyerLostAuctions/BuyerLostAuctionsDetail';
import PlaceBidModal from '../Components/BuyerPanel/BuyerSharedComponents/PlaceBidModal';
import BidPlacedModal from '../Components/BuyerPanel/BuyerSharedComponents/BidPlacedModal';
import BuyerLogout from '../Components/BuyerPanel/BuyerLogout';
import BuyerAuctionResultDetail from '../Components/BuyerPanel/BuyerSharedComponents/BuyerAuctionResultDetail';
import BuyerMyBidsDetail from '../Components/BuyerPanel/BuyerMyBids/BuyerMyBidsDetail';
import BuyerBrowseAuctionsDetail from '../Components/BuyerPanel/BuyerBrowseAuctions/BuyerBrowseAuctionsDetail';

function BuyerPanelPage() {

    const [currentPage, setCurrentPage] = useState("browse-auctions");
    const [previousPage, setPreviousPage] = useState(null);
    const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [selectedSellerId, setSelectedSellerId] = useState(null);
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [selectedLostId, setSelectedLostId] = useState(null);

    // bid placed
    const [bidResultData, setBidResultData] = useState(null);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    const [bidVehicleId, setBidVehicleId] = useState(null);
    const [bidStep, setBidStep] = useState('form'); // 'form' | 'success'

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

    const openBidModal = (vehicleId, fromPage) => {
        setBidVehicleId(vehicleId);
        setPreviousPage(fromPage);
        setBidStep('form');
        setBidResultData(null);
        setIsBidModalOpen(true);
    };

    const closeBidModal = () => {
        setIsBidModalOpen(false);
        setBidStep('form');
    };

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
                <BuyerSidebar
                    collapsed={sideBarCollapsed}
                    mobileOpen={mobileSidebarOpen}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                    onToggle={handleToggleSidebar}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    openLogoutModal={() => setIsLogoutModalOpen(true)}
                />

                <div className='flex-1 flex flex-col overflow-hidden'>
                    <BuyerNavbar
                        setCurrentPage={setCurrentPage}
                        sidebarCollapsed={sideBarCollapsed}
                        onToggleSideBar={handleToggleSidebar}
                    />

                    <main className='flex overflow-y-auto bg-transparent'>
                        <div className='p-6 space-y-6 w-full'>

                            {/* dashboard */}
                            {currentPage === "dashboard" &&
                                <BuyerDashboard
                                    openBidModal={openBidModal}
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    setPreviousPage={setPreviousPage}
                                />}

                            {/* browse auctions */}
                            {currentPage === "browse-auctions" &&
                                <BuyerBrowseAuction
                                    setCurrentPage={setCurrentPage}
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    setPreviousPage={setPreviousPage}
                                    openBidModal={openBidModal}
                                />}

                            {currentPage === 'browse-auctions-detail' &&
                                <BuyerBrowseAuctionsDetail
                                    selectedVehicleId={selectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    previousPage={previousPage}
                                    openBidModal={openBidModal}
                                />}

                            {/* live auctions */}
                            {currentPage === "live-auctions" &&
                                <BuyerLiveAuctions
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    setPreviousPage={setPreviousPage}
                                />}

                            {/* upcoming auctions */}
                            {currentPage === "upcoming-auctions" &&
                                <BuyerUpcomingAuctions
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    setPreviousPage={setPreviousPage}
                                />}

                            {/* seller profile */}
                            {currentPage === "seller-profile" && (
                                <SellerProfilePage
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    sellerId={selectedSellerId}
                                    setCurrentPage={setCurrentPage}
                                    previousPage={previousPage} />
                            )}

                            {/* seller- inventory detail page */}
                            {currentPage === "seller-inventory-detail" && (
                                <SellerInventoryDetail
                                    vehicleId={selectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    setSelectedSellerId={setSelectedSellerId}
                                    setPreviousPage={setPreviousPage}
                                />
                            )}

                            {/* watchlist */}
                            {currentPage === "watchlist" &&
                                <BuyerWatchlist
                                    setCurrentPage={setCurrentPage}
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    setPreviousPage={setPreviousPage}
                                    openBidModal={openBidModal}
                                />}

                            {/* bids */}
                            {currentPage === "bids" && (<BuyerMyBids setCurrentPage={setCurrentPage} setSelectedBidId={setSelectedBidId} setPreviousPage={setPreviousPage} />)}
                            {currentPage === 'bids-detail' && <BuyerMyBidsDetail bidId={selectedBidId} setCurrentPage={setCurrentPage} />}

                            {/* won auctions */}
                            {currentPage === "won-auctions" && <BuyerWonAuctions setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "won-auctions-detail" && <BuyerWonAuctionsDetail vehicleId={selectedVehicleId} setCurrentPage={setCurrentPage} />}

                            {/* lost auctions */}
                            {currentPage === "lost-auctions" && <BuyerLostAuctions setSelectedLostId={setSelectedLostId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "lost-auctions-detail" && <BuyerLostAuctionsDetail lostId={selectedLostId} setCurrentPage={setCurrentPage} />}

                            {/* my offers */}
                            {currentPage === "my-offers" && <BuyerMyOffers setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "offers-detail" && (<BuyerMyOffersDetail vehicleId={selectedVehicleId} setCurrentPage={setCurrentPage} />)}

                            {/* payments */}
                            {currentPage === "payments" && <BuyerPayments setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "payments-detail" && (
                                <BuyerPaymentsDetail
                                    vehicleId={selectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    setSelectedSellerId={setSelectedSellerId}
                                    setPreviousPage={setPreviousPage}
                                />)
                            }

                            {/* invoices */}
                            {currentPage === "invoices" && <BuyerInvoices setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}

                            {/* profile */}
                            {currentPage === "profile" && <BuyerProfile setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}

                            {/* support */}
                            {currentPage === "support" && <BuyerSupport setCurrentPage={setCurrentPage} />}

                            {/* bid placed */}
                            {isBidModalOpen && bidStep === 'form' && (
                                <PlaceBidModal
                                    vehicleId={bidVehicleId}
                                    onClose={closeBidModal}
                                    onBidPlaced={(data) => {
                                        setBidResultData(data);
                                        setBidStep('success');
                                    }}
                                />
                            )}
                            {isBidModalOpen && bidStep === 'success' && bidResultData && (
                                <BidPlacedModal
                                    vehicle={bidResultData.vehicle}
                                    newBid={bidResultData.newBid}
                                    previousBid={bidResultData.previousBid}
                                    previousPage={previousPage}
                                    setCurrentPage={setCurrentPage}
                                    onClose={closeBidModal}
                                />
                            )}

                            {/* for sold/unsold */}
                            {currentPage === "auction-result-detail" &&
                                <BuyerAuctionResultDetail
                                    vehicleId={selectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    previousPage={previousPage}
                                />
                            }

                            {/* logout */}
                            {isLogoutModalOpen && (
                                <BuyerLogout onClose={() => setIsLogoutModalOpen(false)} />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default BuyerPanelPage;