
import Bid from '../models/bidModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import mongoose from 'mongoose';

import { getNextBidId } from '../utils/counterHelper.js';
import { createNotification } from '../services/notificationService.js';
import { emitToVehicle } from '../sockets/socketEmitter.js';

// SELLER + BUYER : place bid only for price_type = reserve_price
export const placeBid = async (req, res) => {
    try {
        const { vehicleId, amount } = req.body;
        const amt = Number(amount);

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

        if (!mongoose.isValidObjectId(vehicleId) || !Number.isFinite(amt) || amt <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid vehicleId and amount are required'
            });
        }

        const vehicle = await Vehicle.findOne({ _id: vehicleId, adminStatus: 'approved' });

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

        if (!vehicle.auctionEndDateTime || vehicle.auctionEndDateTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'This auction has ended'
            });
        }

        const minimumAllowed = vehicle.currentBid ?? vehicle.startingBidPrice;
        if (amt <= minimumAllowed) {
            return res.status(400).json({
                success: false,
                message: `Bid must be higher than AED ${minimumAllowed.toLocaleString()}`
            });
        }

        // ---- CAPTURE OLD STATE BEFORE OVERWRITING ----
        const isFirstBid = vehicle.currentBid == null;
        const wasReserveMetBefore = vehicle.currentBid != null && vehicle.currentBid >= vehicle.reservePrice;

        await Bid.updateMany(
            { vehicleId, status: 'active' },
            { $set: { status: 'outbid' } }
        );

        const newBid = await Bid.create({
            vehicleId,
            bidderId: bidderId,
            bidderType,
            bidId: await getNextBidId(),
            amount: amt,
            status: 'active'
        });

        vehicle.currentBid = amt;

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

        // ---- NAYA: real-time-broadcast (bidding) ----
        try {
            emitToVehicle(vehicleId, 'bidUpdate', {
                vehicleId,
                currentBid: vehicle.currentBid,
                auctionEndDateTime: vehicle.auctionEndDateTime,
                extensionCount: vehicle.extensionCount,
            });
        } catch (e) {
            console.error('[socket] bidUpdate emit failed:', e.message);
        }

        // ---- NOTIFICATION TRIGGERS ----
        if (isFirstBid) {
            await createNotification({
                recipientId: vehicle.sellerId,
                recipientType: 'Seller',
                type: 'new_bid_received',
                vehicleId: vehicle._id,
                title: 'New Bid Received',
                message: `${vehicle.listingId} received a new bid of AED ${amt}.`,
            });
        }

        const reserveJustMet = !wasReserveMetBefore && amt >= vehicle.reservePrice;
        if (reserveJustMet) {
            await createNotification({
                recipientId: vehicle.sellerId,
                recipientType: 'Seller',
                type: 'reserve_price_met',
                vehicleId: vehicle._id,
                title: 'Reserve Price Met',
                message: `${vehicle.listingId} has reached the reserve price.`,
            });
        }

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

        const totalBids = await Bid.countDocuments({ vehicleId: id, status: { $ne: 'archived' } });

        const bids = await Bid.find({ vehicleId: id, status: { $ne: 'archived' } })
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

// SELLER + BUYER : get my-bids 
const BID_STATUSES = ['active', 'outbid', 'won', 'withdrawn', 'canceled'];

export const getMyBids = async (req, res) => {
    try {
        const bidderId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status, search, auctionType } = req.query;

        // ---- step 1: resolve vehicleIds if search/auctionType filters are present ----

        let vehicleIdFilter = null;

        if ((search && search.trim()) || (auctionType && auctionType !== 'all')) {
            const vehicleMatch = {};

            if (auctionType && auctionType !== 'all') {
                vehicleMatch.auctionType = auctionType;
            }

            if (search && search.trim()) {
                const term = search.trim();
                const regex = new RegExp(term, 'i');
                const orConditions = [
                    { make: regex },
                    { model: regex },
                    { vin: regex },
                    { listingId: regex }
                ];
                if (!isNaN(term)) {
                    orConditions.push({ year: Number(term) });
                }
                vehicleMatch.$or = orConditions;
            }

            const matchingVehicles = await Vehicle.find(vehicleMatch).select('_id');
            vehicleIdFilter = matchingVehicles.map((v) => v._id);

            if (vehicleIdFilter.length === 0) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    bids: [],
                    pagination: { currentPage: page, totalPages: 0, totalCount: 0, limit },
                    message: 'No bids found'
                });
            }
        }

        // ---- step 2: build the actual Bid filter ----
        const filter = { bidderId: new mongoose.Types.ObjectId(bidderId) };

        if (status === 'lost') {
            const endedVehicles = await Vehicle.find({
                auctionStatus: { $in: ['sold', 'unsold', 'reserve-not-met'] }
            }).select('_id');
            let lostVehicleIds = endedVehicles.map(v => v._id.toString());

            if (vehicleIdFilter) {
                const searchIds = vehicleIdFilter.map(id => id.toString());
                lostVehicleIds = lostVehicleIds.filter(id => searchIds.includes(id));
            }

            filter.status = 'outbid';
            filter.vehicleId = { $in: lostVehicleIds };
        } else if (status && status !== 'all' && BID_STATUSES.includes(status)) {
            filter.status = status;
            if (vehicleIdFilter) {
                filter.vehicleId = { $in: vehicleIdFilter };
            }
        } else if (vehicleIdFilter) {
            filter.vehicleId = { $in: vehicleIdFilter };
        }

        // archived (relist ke baad purani) bids user ko nahi dikhani
        if (!filter.status) filter.status = { $ne: 'archived' };

        const [bids, totalCount] = await Promise.all([
            Bid.find(filter)
                .select('bidId vehicleId bidderId bidderType amount status createdAt')
                .populate({
                    path: 'vehicleId',
                    select: 'images make model year listingId currentBid auctionStatus auctionType auctionEndDateTime vin reservePrice mileage transmission fuelType emirate city',
                    populate: {
                        path: 'sellerId',
                        select: 'businessName createdAt'
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Bid.countDocuments(filter)
        ]);

        const baseFilter = { bidderId: new mongoose.Types.ObjectId(bidderId), status: { $ne: 'archived' } };

        const [allCount, ...statusCounts] = await Promise.all([
            Bid.countDocuments(baseFilter),
            ...BID_STATUSES.map((s) => Bid.countDocuments({ ...baseFilter, status: s }))
        ]);

        const tabCounts = { all: allCount };
        BID_STATUSES.forEach((s, idx) => {
            tabCounts[s] = statusCounts[idx];
        });

        const [amountAgg] = await Bid.aggregate([
            { $match: baseFilter },
            {
                $group: {
                    _id: null,
                    totalAmountBidded: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, '$amount', 0] }
                    },
                    winningAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'won'] }, '$amount', 0] }
                    }
                }
            }
        ]);

        const bidSummary = {
            activeBids: tabCounts.active,
            auctionsWon: tabCounts.won,
            outbid: tabCounts.outbid,
            totalAmountBidded: amountAgg?.totalAmountBidded || 0,
            winningAmount: amountAgg?.winningAmount || 0
        };

        return res.status(200).json({
            success: true,
            count: bids.length,
            bids,
            tabCounts, // { all, active, outbid, won, withdrawn, canceled }
            bidSummary,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            },
            ...(bids.length === 0 && { message: 'No bids found' })
        });

    } catch (error) {
        console.error('Get MyBids error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// SELLER + BUYER : bid withdraw
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

        // ---- NAYA: real-time-broadcast  ----
        try {
            emitToVehicle(vehicle._id.toString(), 'bidUpdate', {
                vehicleId: vehicle._id.toString(),
                currentBid: vehicle.currentBid,
                auctionEndDateTime: vehicle.auctionEndDateTime,
                extensionCount: vehicle.extensionCount,
            });
        } catch (socketErr) {
            console.error('[socket] bidUpdate-emit-failed:', socketErr.message);
        }

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

// ============================== SELLER

// get my bid detail
export const getMyBidDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const bidderId = req.user.id;

        // pagination params — default page 1, 10 per page
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const bid = await Bid.findOne({ _id: id, bidderId: bidderId, status: { $ne: 'archived' } })
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

        const totalBids = await Bid.countDocuments({ vehicleId: bid.vehicleId._id, status: { $ne: 'archived' } });

        // paginated slice of this vehicle's bids
            const vehicleBids = await Bid.find({ vehicleId: bid.vehicleId._id, status: { $ne: 'archived' } })
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

// ============================== BUYER

// get my bid detail
export const getMyBidDetailBuyer = async (req, res) => {
    try {
        const { id } = req.params;
        const bidderId = req.user.id;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const bid = await Bid.findOne({ _id: id, bidderId: bidderId, status: { $ne: 'archived' } })
            .select('vehicleId bidderId bidderType bidId amount status createdAt')
            .populate({
                path: 'vehicleId',
                select: `listingId images vin make model year transmission overallCondition drivetrain fuelType 
                        bodyType startingBidPrice currentBid priceType buyNowPrice reservePrice
                        auctionStatus auctionStartDateTime auctionEndDateTime auctionDuration`
            });

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: "Bid not found!"
            });
        }

        const totalBids = await Bid.countDocuments({ vehicleId: bid.vehicleId._id, status: { $ne: 'archived' } });

        const vehicleBids = await Bid.find({ vehicleId: bid.vehicleId._id, status: { $ne: 'archived' } })
            .select('bidId amount status createdAt')
            .sort({ amount: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // koi bidder-lookup nahi — naam, email, phone kuch bhi nahi fetch/return ho raha

        return res.status(200).json({
            success: true,
            message: "My bid details fetched successfully",
            bid: bid,
            vehicle: bid.vehicleId,
            bids: vehicleBids,
            pagination: {
                page,
                limit,
                totalBids,
                totalPages: Math.max(1, Math.ceil(totalBids / limit)),
            }
        });

    } catch (err) {
        console.log('Get MyBidDetail (Buyer) error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get top bidders
export const getTopBidders = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const requestedLimit = Number(limit);
        const bufferLimit = requestedLimit + 10; // suspended-filter ke liye extra buffer

        const topBidders = await Bid.aggregate([
            { $match: { status: { $in: ['active', 'outbid', 'won', 'withdrawn'] } } },
            {
                $group: {
                    _id: { bidderId: '$bidderId', bidderType: '$bidderType' },
                    totalBids: { $sum: 1 }
                }
            },
            { $sort: { totalBids: -1 } },
            { $limit: bufferLimit },
        ]);

        const populated = await Promise.all(
            topBidders.map(async (b) => {
                const isBuyer = b._id.bidderType === 'Buyer';
                const Model = isBuyer ? Buyer : Seller;
                const fieldsToSelect = isBuyer
                    ? 'firstName lastName profileImageUrl accountStatus'
                    : 'fullName profileImage accountStatus';

                const bidder = await Model.findById(b._id.bidderId).select(fieldsToSelect);
                if (!bidder || bidder.accountStatus === 'suspended') return null;

                const displayName = isBuyer
                    ? `${bidder.firstName || ''} ${bidder.lastName || ''}`.trim() || 'Unknown'
                    : bidder.fullName || 'Unknown';
                const profileImage = isBuyer
                    ? bidder.profileImageUrl || null
                    : bidder.profileImage || null;

                return {
                    bidderId: b._id.bidderId,
                    bidderType: b._id.bidderType,
                    fullName: displayName,
                    profileImage,
                    totalBids: b.totalBids,
                };
            })
        );

        const finalList = populated.filter(Boolean).slice(0, requestedLimit);

        return res.status(200).json({
            success: true,
            message: "Top 10 bidders",
            data: finalList,
            hasMore: finalList.length === requestedLimit,
        });

    } catch (err) {
        console.error("Top bidders error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// ============================== USER 

// get particular public auction bids
export const getPublicAuctionBids = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            })
        };

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        const vehicle = await Vehicle.findOne({ _id: id, adminStatus: 'approved', auctionStatus: { $ne: 'draft' } }).select('_id').lean();
        if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

        const base = { vehicleId: vehicle._id, status: { $nin: ['withdrawn', 'archived'] } };

        const [firstBids, bids, total] = await Promise.all([
            Bid.aggregate([
                { $match: base },
                { $group: { _id: '$bidderId', first: { $min: '$createdAt' } } },
                { $sort: { first: 1, _id: 1 } },
            ]),
            Bid.find(base).sort({ amount: -1, createdAt: -1, _id: 1 })
                .skip((page - 1) * limit).limit(limit)
                .select('amount createdAt bidderId').lean(),
            Bid.countDocuments(base),
        ]);

        const numMap = new Map(firstBids.map((b, i) => [String(b._id), i + 1]));

        res.status(200).json({
            success: true,
            data: bids.map(b => ({
                _id: b._id,
                label: `Bidder #${numMap.get(String(b.bidderId))}`,
                amount: b.amount,
                createdAt: b.createdAt,
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.log('getPublicAuctionBids Error :', err);
        res.status(500).json({ success: false, message: 'Server Error Occured' });
    }
};