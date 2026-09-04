
import Bid from '../models/bidModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';
import Seller from '../models/sellerModelSchema.js';

import { getNextBidId } from '../utils/counterHelper.js';

// seller + buyer : place bid only for price_type = reserve_price
export const placeBid = async (req, res) => {
    try {
        const { vehicleId, amount } = req.body;
        const bidderId = req.user.id;
        let bidderType;

        if (req.user.role === 'buyer') {
            bidderType = 'Buyer';
        } else if (req.user.role === 'seller') {
            bidderType = 'Seller';
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid bidder role'
            });
        }

        if (!vehicleId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'vehicleId and amount are required'
            });
        }

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // seller can't be bid on their own vehicles
        if (bidderType === 'Seller' && vehicle.sellerId.toString() === bidderId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Sellers cannot bid on their own vehicle'
            });
        }

        if (vehicle.priceType !== 'reserve_price') {
            return res.status(400).json({
                success: false,
                message: 'Bidding is not available for fixed price vehicles'
            });
        }

        if (vehicle.auctionStatus !== 'live') {
            return res.status(400).json({
                success: false,
                message: 'This auction is not currently live'
            });
        }

        const minimumAllowed = vehicle.currentBid ?? vehicle.startingBidPrice;
        if (amount <= minimumAllowed) {
            return res.status(400).json({
                success: false,
                message: `Bid must be higher than ${minimumAllowed}`
            });
        }

        await Bid.updateMany(
            { vehicleId, status: 'active' },
            { $set: { status: 'outbid' } }
        );

        const newBid = await Bid.create({
            vehicleId,
            bidderId: bidderId,
            bidderType,
            bidId: await getNextBidId(),
            amount,
            status: 'active'
        });

        vehicle.currentBid = amount;

        // Anti-sniping check / extension check
        const MAX_EXTENSIONS = 5;
        const now = new Date();
        const timeUntilEnd = vehicle.auctionEndDateTime - now; // milliseconds
        const windowMs = (vehicle.antiSnipingWindow ?? 2) * 60 * 1000;

        if (timeUntilEnd <= windowMs && vehicle.extensionCount < MAX_EXTENSIONS) {
            const extensionMs = (vehicle.antiSnipingExtension ?? 2) * 60 * 1000;
            vehicle.auctionEndDateTime = new Date(vehicle.auctionEndDateTime.getTime() + extensionMs);
            vehicle.extensionCount += 1;
        }

        await vehicle.save();

        return res.status(201).json({
            success: true,
            message: 'Bid placed successfully',
            bid: newBid
        });

    } catch (error) {
        console.error('placeBid error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get particular vehcile bids
export const getVehicleBids = async (req, res) => {
    try {
        const { id } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalBids = await Bid.countDocuments({ id });

        const bids = await Bid.find({ id })
            .sort({ amount: -1 })
            .skip(skip)
            .limit(limit);

        const formattedBids = await Promise.all(
            bids.map(async (bid) => {
                let bidder = null;

                if (bid.bidderType === 'Buyer') {
                    bidder = await Buyer.findById(bid.bidderId)
                        .select('firstName lastName email mobile profileImageUrl');
                }

                if (bid.bidderType === 'Seller') {
                    bidder = await Seller.findById(bid.bidderId)
                        .select('fullName email phone profileImage');
                }

                return { ...bid.toObject(), bidder };
            })
        );

        return res.status(200).json({
            success: true,
            count: formattedBids.length,
            totalBids,
            currentPage: page,
            totalPages: Math.ceil(totalBids / limit),
            limit,
            bids: formattedBids
        });

    } catch (error) {
        console.error('Get VehicleBids error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get my-bids
export const getMyBids = async (req, res) => {
    try {
        const bidderId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status } = req.query;

        const filter = { bidderId };

        if (status) { filter.status = status; }

        const [bids, totalCount] = await Promise.all([
            Bid.find(filter)
                .select('bidId vehicleId bidderId bidderType amount status createdAt')
                .populate({
                    path: 'vehicleId',
                    select: 'images make model year listingId currentBid auctionStatus auctionEndDateTime vin reservePrice'
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Bid.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            bids,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        });

    } catch (error) {
        console.error('Get MyBids error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// NOT WORKED - get my bid detail
export const getMyBidDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const bidderId = req.user.id;

        // pagination params — default page 1, 10 per page
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const bid = await Bid.findOne({ _id: id, bidderId: bidderId })
            .select('vehicleId bidderId bidderType bidId amount status createdAt')
            .populate({
                path: 'vehicleId',
                select: `listingId images vin make model year transmission overallCondition drivetrain fuelType bodyType startingBidPrice currentBid priceType buyNowPrice reservePrice
                    auctionStatus auctionStartDateTime auctionEndDateTime auctionDuration`
            });

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: "Bid not found!"
            });
        }

        // total count for this vehicle (needed for pagination meta — separate from the paginated fetch)
        const totalBids = await Bid.countDocuments({ vehicleId: bid.vehicleId._id });

        // paginated slice of this vehicle's bids
        const vehicleBids = await Bid.find({ vehicleId: bid.vehicleId._id })
            .select('bidId bidderId bidderType amount status createdAt')
            .sort({ amount: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get bidder details for this page only
        const formattedBids = await Promise.all((
            vehicleBids.map(async (item) => {
                let bidder = null;

                if (item.bidderType === 'Buyer') {
                    bidder = await Buyer.findById(item.bidderId)
                        .select('buyerId profileImageUrl firstName lastName email mobile')
                        .lean();
                }

                if (item.bidderType === 'Seller') {
                    bidder = await Seller.findById(item.bidderId)
                        .select('sellerId profileImage fullName email phone')
                        .lean();
                }
                return {
                    ...item,
                    bidder
                };
            })
        ));

        return res.status(200).json({
            success: true,
            message: "My bid details fetched successfully",
            bid: bid,
            vehicle: bid.vehicleId,
            bids: formattedBids,
            pagination: {
                page,
                limit,
                totalBids,
                totalPages: Math.max(1, Math.ceil(totalBids / limit)),
            }
        });

    } catch (err) {
        console.log('Get MyBids Detail error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// bid withdraw
export const withdrawBid = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const bid = await Bid.findById(id);

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found'
            });
        }

        // Ownership check — only the bidder can withdraw their own bid
        if (bid.bidderId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only withdraw your own bid'
            });
        }

        // Only active bids can be withdrawn
        if (bid.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: `Cannot withdraw a bid with status '${bid.status}'`
            });
        }

        const vehicle = await Vehicle.findById(bid.vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        if (vehicle.auctionStatus !== 'live') {
            return res.status(400).json({
                success: false,
                message: 'Cannot withdraw bid — auction is not currently live'
            });
        }

        // Withdraw-lock window check (same field as anti-sniping)
        const now = new Date();
        const timeUntilEnd = vehicle.auctionEndDateTime - now;
        const windowMs = (vehicle.antiSnipingWindow ?? 2) * 60 * 1000;
        if (timeUntilEnd <= windowMs) {
            return res.status(400).json({
                success: false,
                message: 'Cannot withdraw bid this close to auction end'
            });
        }

        bid.status = 'withdrawn';
        await bid.save();

        // Find next-highest bid among outbid bids
        const nextHighest = await Bid.findOne({
            vehicleId: vehicle._id,
            status: 'outbid'
        }).sort({ amount: -1 });

        if (nextHighest) {
            nextHighest.status = 'active';
            await nextHighest.save();
            vehicle.currentBid = nextHighest.amount;
        } else {
            vehicle.currentBid = vehicle.startingBidPrice;
        }

        await vehicle.save();

        return res.status(200).json({
            success: true,
            message: 'Bid withdrawn successfully'
        });

    } catch (err) {
        console.error("Withdraw Bid Error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};