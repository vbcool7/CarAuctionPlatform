
// seller can edit only draft and pcoming vehicles
export const canSellerEdit = (vehicle) =>
    ['draft', 'upcoming'].includes(vehicle?.auctionStatus);

export const sellerEditBlockedMessage = (vehicle) =>
    vehicle?.auctionStatus === 'live'
        ? 'Live auctions cannot be edited. Please contact support.'
        : 'This vehicle cannot be edited at this stage. Please contact support.';