
import React, { useState } from 'react';
import BuyerSidebar from '../Components/BuyerPanel/BuyerSidebar';
import BuyerNavbar from '../Components/BuyerPanel/BuyerNavbar';
import BuyerDashboard from '../Components/BuyerPanel/BuyerDashboard/BuyerDashboard';
import BuyerBrowseAuction from '../Components/BuyerPanel/BuyerBrowseAuctions/BuyerBrowseAuction';
import BuyerUpcomingAuctions from '../Components/BuyerPanel/BuyerUpcomingAuctions/BuyerUpcomingAuctions';
import BuyerUpcomingAuctionDetail from '../Components/BuyerPanel/BuyerUpcomingAuctions/BuyerUpcomingAuctionDetail';
import BuyerLiveAuctions from '../Components/BuyerPanel/BuyerLiveAuctions/BuyerLiveAuctions';
import BuyerLiveAuctionDetail from '../Components/BuyerPanel/BuyerLiveAuctions/BuyerLiveAuctionDetail';
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
import BuyerLogout from '../Components/BuyerPanel/BuyerSharedComponents/BuyerLogout';
import BuyerAuctionResultDetail from '../Components/BuyerPanel/BuyerSharedComponents/BuyerAuctionResultDetail';

function BuyerPanelPage() {

    const [currentPage, setCurrentPage] = useState("dashboard");
    const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    const [selectedSellerId, setSelectedSellerId] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // bid placed
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
        setIsBidModalOpen(true);
    };

    const closeBidModal = () => {
        setIsBidModalOpen(false);
        setBidStep('form');
    };

    return (
        <div className='min-h-screen bg-white transition-all duration-500'>

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

                            {/* upcoming auctions */}
                            {currentPage === "upcoming-auctions" && <BuyerUpcomingAuctions setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "upcoming-auctions-detail" &&
                                <BuyerUpcomingAuctionDetail
                                    vehicleId={selectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    setSelectedSellerId={setSelectedSellerId}
                                    setPreviousPage={setPreviousPage}
                                />
                            }

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

                            {/* live auctions */}
                            {currentPage === "live-auctions" && <BuyerLiveAuctions setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "live-auctions-detail" && (
                                <BuyerLiveAuctionDetail
                                    vehicleId={selectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                    setSelectedSellerId={setSelectedSellerId}
                                    setPreviousPage={setPreviousPage}
                                    openBidModal={openBidModal}
                                    previousPage={previousPage}
                                />)
                            }

                            {/* watchlist */}
                            {currentPage === "watchlist" &&
                                <BuyerWatchlist
                                    setCurrentPage={setCurrentPage}
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    setPreviousPage={setPreviousPage}
                                    openBidModal={openBidModal}
                                />}

                            {/* bids */}
                            {currentPage === "bids" && (
                                <BuyerMyBids
                                    setCurrentPage={setCurrentPage}
                                    setSelectedVehicleId={setSelectedVehicleId}
                                    setPreviousPage={setPreviousPage}
                                />
                            )}

                            {/* won auctions */}
                            {currentPage === "won-auctions" && <BuyerWonAuctions setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "won-auctions-detail" && (
                                <BuyerWonAuctionsDetail vehicleId={selectedVehicleId} setCurrentPage={setCurrentPage} />)
                            }

                            {/* lost auctions */}
                            {currentPage === "lost-auctions" && <BuyerLostAuctions setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "lost-auctions-detail" &&
                                <BuyerLostAuctionsDetail
                                    vehicleId={selectedVehicleId}
                                    setCurrentPage={setCurrentPage}
                                />
                            }

                            {/* my offers */}
                            {currentPage === "my-offers" && <BuyerMyOffers setSelectedVehicleId={setSelectedVehicleId} setCurrentPage={setCurrentPage} />}
                            {currentPage === "offers-detail" && (
                                <BuyerMyOffersDetail vehicleId={selectedVehicleId} setCurrentPage={setCurrentPage} />)
                            }

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
                                    onBidPlaced={() => setBidStep('success')}
                                />
                            )}
                            {isBidModalOpen && bidStep === 'success' && (
                                <BidPlacedModal
                                    vehicleId={bidVehicleId}
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