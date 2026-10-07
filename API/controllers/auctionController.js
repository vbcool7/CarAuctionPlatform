
import Admin from '../models/adminModelSchema.js';
import Bid from '../models/bidModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';
import mongoose from 'mongoose';

import { UAE_UTC_OFFSET_HOURS, parseTime12h } from '../models/vehicleModelSchema.js';
import { createNotification } from '../services/notificationService.js';
import { createPayoutForSale } from '../utils/createPayout.js';

// RESERVE PRICE - Moves upcoming auctions to live when start time arrives
export const runAuctionStatusUpdate = async () => {
    const now = new Date();

    // find upcoming vehicles jinka start time aa chuka hai
    const vehiclesToGoLive = await Vehicle.find({
        auctionStatus: "upcoming",
        adminStatus: "approved",
        auctionStartDate: { $exists: true },
        auctionStartTime: { $exists: true },
    });

    let updatedCount = 0;

    for (const vehicle of vehiclesToGoLive) {
        const parsed = parseTime12h(vehicle.auctionStartTime);
        if (!parsed) continue;

        const startDateTime = new Date(vehicle.auctionStartDate);
        startDateTime.setUTCHours(
            parsed.hours - UAE_UTC_OFFSET_HOURS,
            parsed.minutes,
            0,
            0
        );

        if (now >= startDateTime) {
            vehicle.auctionStatus = 'live';
            await vehicle.save();
            updatedCount++;
        }
    }
    return updatedCount;
};

// RESERVE PRICE - Moves live auctions to sold/unsold/reserve-not-met when end time passes
export const runAuctionEndUpdate = async () => {
    const now = new Date();

    const admin = await Admin.findOne();

    const vehiclesToClose = await Vehicle.find({
        auctionStatus: 'live',
        priceType: 'reserve_price',
        auctionEndDateTime: { $lte: now },
    });

    let updatedCount = 0;

    for (const vehicle of vehiclesToClose) {
        const winningBid = await Bid.findOne({
            vehicleId: vehicle._id,
            status: 'active',
        });

        let notifType, notifTitle, notifMessage;

        if (!winningBid) {
            vehicle.auctionStatus = 'unsold';
            notifType = 'auction_unsold';
            notifTitle = 'Auction Unsold';
            notifMessage = `${vehicle.listingId} was not sold because no bids were received.`;

        } else if (vehicle.currentBid < vehicle.reservePrice) {
            vehicle.auctionStatus = 'reserve-not-met';
            notifType = 'reserve_not_met';
            notifTitle = 'Reserve Price Not Met';
            notifMessage = `${vehicle.listingId} did not meet the reserve price.`;

        } else {
            vehicle.auctionStatus = 'sold';
            vehicle.soldOn = new Date();

            winningBid.status = 'won';
            await winningBid.save();

            // payout create 
            try {
                await createPayoutForSale({
                    vehicleId: vehicle._id,
                    sellerId: vehicle.sellerId,
                    buyerId: winningBid.bidderId,
                    buyerType: winningBid.bidderType,
                    saleAmount: winningBid.amount,
                    saleType: 'Bid',
                    sourceId: winningBid._id,
                });
            } catch (payoutErr) {
                console.error('CRITICAL: Payout creation failed for vehicle', vehicle._id, payoutErr);
            }

            notifType = 'auction_sold';
            notifTitle = 'Your vehicle has been sold';
            notifMessage = `${vehicle.listingId} was sold for AED ${winningBid.amount}.`;
        }

        await vehicle.save();
        updatedCount++;

        await createNotification({
            recipientId: vehicle.sellerId,
            recipientType: 'Seller',
            type: notifType,
            vehicleId: vehicle._id,
            title: notifTitle,
            message: notifMessage,
        });

        // ---- ADMIN NOTIFICATION (naya, sirf sold case me) ----
        if (notifType === 'auction_sold' && admin) {
            await createNotification({
                recipientId: admin._id,
                recipientType: 'Admin',
                type: 'auction_sold',
                vehicleId: vehicle._id,
                title: 'Vehicle Sold',
                message: `${vehicle.listingId} was sold for AED ${winningBid.amount}.`,
            });
        }
    }
    return updatedCount;
};

// FIXED PRICE - Moves live fixed_price vehicles to 'unsold' when the auction window expires without a purchase
export const runFixedPriceExpiry = async () => {
    const now = new Date();

    const vehiclesToExpire = await Vehicle.find({
        auctionStatus: 'live',
        priceType: 'fixed_price',
        auctionEndDateTime: { $lte: now },
    });

    let updatedCount = 0;

    for (const vehicle of vehiclesToExpire) {
        vehicle.auctionStatus = 'unsold';
        await vehicle.save();
        updatedCount++;

        // notification trigger — to seller
        await createNotification({
            recipientId: vehicle.sellerId,
            recipientType: 'Seller',
            type: 'auction_unsold',
            vehicleId: vehicle._id,
            title: 'Auction Unsold',
            message: `${vehicle.listingId} was not sold before the auction ended.`,
        });
    }

    return updatedCount;
};

// get seller vehicles that are in auction stage 
const TAB_STATUS_MAP = {
    active: 'live',
    scheduled: 'upcoming',
    ended: { $in: ['sold', 'unsold', 'reserve-not-met'] },
    canceled: 'canceled'
};

export const getMyAuctions = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { tab = 'active', search, auctionType, sortBy } = req.query;

        if (!TAB_STATUS_MAP[tab]) {
            return res.status(400).json({
                success: false,
                message: `Invalid tab: ${tab}. Must be one of active, scheduled, ended, canceled`
            });
        }

        const baseFilter = {
            sellerId: new mongoose.Types.ObjectId(sellerId),
            adminStatus: 'approved'
        };

        // filter for the currently requested tab
        const filter = { ...baseFilter, auctionStatus: TAB_STATUS_MAP[tab] };

        if (auctionType && auctionType !== 'all') {
            filter.auctionType = auctionType; // 'live' | 'timed'
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

            filter.$or = orConditions;
        }

        const sortStage = sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

        const countPromises = Object.keys(TAB_STATUS_MAP).map((tabKey) =>
            Vehicle.countDocuments({ ...baseFilter, auctionStatus: TAB_STATUS_MAP[tabKey] })
        );


        const [vehicles, totalCount, ...tabCounts] = await Promise.all([
            Vehicle.find(filter)
                .sort(sortStage)
                .skip(skip)
                .limit(limit),
            Vehicle.countDocuments(filter),
            ...countPromises
        ]);

        const counts = Object.keys(TAB_STATUS_MAP).reduce((acc, tabKey, idx) => {
            acc[tabKey] = tabCounts[idx];
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            count: vehicles.length,
            vehicles,
            tabCounts: counts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            },
            ...(vehicles.length === 0 && { message: 'No auctions found' })
        });

    } catch (err) {
        console.error("Get My Auctions Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get auc by id
export const getMyAuctionById = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user.id;

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle Detail not found"
            });
        }

        // Ownership check — seller can only view their own auction's detail
        if (vehicle.sellerId.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this auction"
            });
        }

        // find all bids of this vehicle
        const allBids = await Bid.find({ vehicleId: vehicle._id }).sort({ createdAt: -1 });

        // resolve bidder info with each bid
        const bidsWithBidderInfo = await Promise.all(
            allBids.map(async (bid) => {
                let bidderInfo = null;

                if (bid.bidderType === 'Buyer') {
                    const bidder = await Buyer.findById(bid.bidderId).select('firstName lastName email mobile profileImageUrl');
                    if (bidder) {
                        bidderInfo = {
                            name: `${bidder.firstName} ${bidder.lastName}`,
                            email: bidder.email,
                            phone: bidder.mobile,
                            profileImageUrl: bidder.profileImageUrl,
                        };
                    }
                } else if (bid.bidderType === 'Seller') {
                    const bidder = await Seller.findById(bid.bidderId).select('fullName email phone profileImage');
                    if (bidder) {
                        bidderInfo = {
                            name: bidder.fullName,
                            email: bidder.email,
                            phone: bidder.phone,
                            profileImageUrl: bidder.profileImage,
                        };
                    }
                }

                return {
                    _id: bid._id,
                    bidId: bid.bidId,
                    amount: bid.amount,
                    status: bid.status,
                    bidderType: bid.bidderType,
                    bidderId: bid.bidderId,
                    bidder: bidderInfo,
                    createdAt: bid.createdAt,
                    updatedAt: bid.updatedAt,
                };
            })
        );

        // find only unique bidders
        const participantsMap = {};

        bidsWithBidderInfo.forEach((bid) => {
            const key = bid.bidderId?.toString();
            if (!key) return;

            if (!participantsMap[key]) {
                participantsMap[key] = {
                    bidderId: bid.bidderId,
                    bidderType: bid.bidderType,
                    bidder: bid.bidder,
                    totalBids: 0,
                    firstBidAt: bid.createdAt,
                };
            }

            participantsMap[key].totalBids += 1;
            if (bid.createdAt < participantsMap[key].firstBidAt) {
                participantsMap[key].firstBidAt = bid.createdAt;
            }
        });

        const participants = Object.values(participantsMap);

        // soldTo (if sold) - find only winning bidder
        let soldTo = null;

        if (vehicle.auctionStatus === 'sold') {
            const winningBid = bidsWithBidderInfo.find((b) => b.status === 'won');
            if (winningBid) {
                soldTo = winningBid.bidder;
            }
        }

        return res.status(200).json({
            success: true,
            message: "Here is your auction detail",
            data: {
                vehicle,
                bids: bidsWithBidderInfo,
                participants,
                soldTo,
                bidsCount: bidsWithBidderInfo.length,
                bidderCount: participants.length,
            }
        });
    } catch (err) {
        console.error("Get My Auction Detail Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// auction cancel - admin + manager + seller 
export const cancelAuction = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: "Cancellation reason is required"
            });
        }

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Auction not found"
            });
        }

        // ownership check — seller cancel only their own vehicle's auction
        if (role === 'seller' && vehicle.sellerId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this auction"
            });
        }

        // stage check — only upcoming/live auc can cancel
        if (!['upcoming', 'live'].includes(vehicle.auctionStatus)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel an auction with status '${vehicle.auctionStatus}'`
            });
        }

        const wasLive = vehicle.auctionStatus === 'live';

        vehicle.statusAtCancellation = vehicle.auctionStatus; // before overwrite to save prev auc status
        vehicle.canceledAt = new Date();
        vehicle.auctionStatus = 'canceled';
        vehicle.currentBid = null;
        vehicle.canceledBy = role; // 'seller' or 'admin' or 'auctionManager'
        vehicle.canceledByUserId = role === 'auctionManager' ? userId : null;
        vehicle.cancellationReason = reason.trim();
        await vehicle.save();

        // if live - then mark all bids as canceled
        if (wasLive) {

            // for notification — fetch before updating
            const affectedBids = await Bid.find({
                vehicleId: vehicle._id,
                status: { $in: ['active', 'outbid'] },
            });

            await Bid.updateMany(
                { vehicleId: vehicle._id, status: { $in: ['active', 'outbid'] } },
                { $set: { status: 'canceled' } }
            );

            // notify to each unique bidder
            const uniqueBidders = new Map();
            for (const bid of affectedBids) {
                uniqueBidders.set(bid.bidderId.toString(), bid.bidderType);
            }

            for (const [bidderId, bidderType] of uniqueBidders) {
                await createNotification({
                    recipientId: bidderId,
                    recipientType: bidderType,
                    type: 'auction_canceled',
                    vehicleId: vehicle._id,
                    title: 'Auction Canceled',
                    message: `The auction for ${vehicle.listingId}, which you had a bid on, has been canceled. Reason: ${reason.trim()}`,
                });
            }
        }

        if (role === 'admin') {
            await createNotification({
                recipientId: vehicle.sellerId,
                recipientType: 'Seller',
                type: 'auction_canceled',
                vehicleId: vehicle._id,
                title: 'Auction Canceled',
                message: `${vehicle.listingId} was canceled by admin. Reason: ${reason.trim()}`,
            });
        }

        if (role === 'seller') {
            const admin = await Admin.findOne();
            if (admin) {
                await createNotification({
                    recipientId: admin._id,
                    recipientType: 'Admin',
                    type: 'auction_canceled',
                    vehicleId: vehicle._id,
                    title: 'Auction Canceled by Seller',
                    message: `${vehicle.listingId} was canceled by the seller. Reason: ${reason.trim()}`,
                });
            }
        }

        if (role === 'auctionManager') {
            // tell the Seller
            await createNotification({
                recipientId: vehicle.sellerId,
                recipientType: 'Seller',
                type: 'auction_canceled',
                vehicleId: vehicle._id,
                title: 'Auction Canceled',
                message: `${vehicle.listingId} was canceled by a manager. Reason: ${reason.trim()}`,
            });

            // tell the Admin 
            const admin = await Admin.findOne({ role: 'admin' });
            if (admin) {
                await createNotification({
                    recipientId: admin._id,
                    recipientType: 'Admin',
                    type: 'auction_canceled',
                    vehicleId: vehicle._id,
                    title: 'Auction Canceled by Manager',
                    message: `${vehicle.listingId} was canceled by a manager. Reason: ${reason.trim()}`,
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Auction canceled successfully",
            vehicle
        });

    } catch (err) {
        console.error("Cancel Auction Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// ================================= BUYER SIDE

// all auctions 
export const getDistinctMakes = async (req, res) => {
    try {
        const makes = await Vehicle.distinct('make', { adminStatus: 'approved' });
        return res.status(200).json({ success: true, data: makes.sort() });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error Occurred" });
    }
};

export const getDistinctModels = async (req, res) => {
    try {
        const { make } = req.query;
        if (!make) {
            return res.status(400).json({ success: false, message: "make is required" });
        }
        const models = await Vehicle.distinct('model', { adminStatus: 'approved', make });
        return res.status(200).json({ success: true, data: models.sort() });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error Occurred" });
    }
};

export const getDateFilterRange = (dateFilter) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const endOfThisWeek = new Date(startOfToday);
    endOfThisWeek.setDate(endOfThisWeek.getDate() + 7);

    const endOfNextWeek = new Date(startOfToday);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 14);

    switch (dateFilter) {
        case 'today':
            return { $gte: startOfToday, $lt: endOfToday };
        case 'this_week':
            return { $gte: startOfToday, $lt: endOfThisWeek };
        case 'next_week':
            return { $gte: endOfThisWeek, $lt: endOfNextWeek };
        default:
            return null; // 'all' or n any param
    }
};

export const getAllAuctions = async (req, res) => {
    try {
        const { tab, make, model, year, bodyType, priceRange, sortBy, search, dateFilter, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const matchStage = {
            adminStatus: 'approved',
        };

        // ---- tab filter ----
        switch (tab) {
            case 'live':
                matchStage.auctionStatus = 'live';
                break;
            case 'upcoming':
                matchStage.auctionStatus = 'upcoming';
                if (dateFilter) {
                    const range = getDateFilterRange(dateFilter);
                    if (range) matchStage.auctionStartDateTime = range;
                }
                break;
            case 'ended':
                matchStage.auctionStatus = { $in: ['sold', 'unsold', 'reserve-not-met'] };
                break;
            case 'canceled':
                matchStage.auctionStatus = 'canceled';
                break;
            case 'all':
            default:
                matchStage.auctionStatus = { $in: ['upcoming', 'live', 'sold', 'unsold', 'reserve-not-met', 'canceled'] };
                break;
        }

        if (make) matchStage.make = make;
        if (model) matchStage.model = model;
        if (year) matchStage.year = Number(year);
        if (bodyType) matchStage.bodyType = bodyType;

        // ---- search filter (make, model, listingId) ----
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            matchStage.$or = [
                { make: searchRegex },
                { model: searchRegex },
                { listingId: searchRegex },
            ];

            // ---- year: numeric search, only add if search term is a valid number ----
            const searchAsNumber = Number(search.trim());
            if (!isNaN(searchAsNumber)) {
                matchStage.$or.push({ year: searchAsNumber });
            }
        }

        const pipeline = [
            { $match: matchStage },

            // ---- effective price computed field ----
            {
                $addFields: {
                    effectivePrice: {
                        $ifNull: [
                            "$currentBid",
                            { $ifNull: ["$startingBidPrice", "$buyNowPrice"] }
                        ]
                    }
                }
            },

            // ---- bids lookup (active/outbid/won only) ----
            {
                $lookup: {
                    from: 'bids',
                    let: { vehicleId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$vehicleId', '$$vehicleId'] },
                                status: { $in: ['active', 'outbid', 'won'] }
                            }
                        }
                    ],
                    as: 'bidsArr'
                }
            },

            // ---- watchlist look up
            {
                $lookup: {
                    from: 'watchlists',
                    let: { vId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$userId', new mongoose.Types.ObjectId(req.user.id)] } } },
                        { $match: { $expr: { $in: ['$$vId', '$items.vehicleId'] } } }
                    ],
                    as: 'watchlistMatch'
                }
            },
            {
                $addFields: { totalBids: { $size: '$bidsArr' } }
            },

            // seller info
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'sellerId',
                    foreignField: '_id',
                    as: 'sellerInfo'
                }
            },
            {
                $unwind: {
                    path: '$sellerInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
        ];

        // ---- price range filter 
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            pipeline.push({
                $match: {
                    effectivePrice: { $gte: min, $lte: max }
                }
            });
        }

        // ---- sort ----
        switch (sortBy) {
            case 'price_low_high':
                pipeline.push({ $sort: { effectivePrice: 1 } });
                break;
            case 'price_high_low':
                pipeline.push({ $sort: { effectivePrice: -1 } });
                break;
            case 'ending_soon':
                pipeline.push({ $sort: { auctionEndDateTime: 1 } });
                break;
            case 'newest':
            default:
                pipeline.push({ $sort: { createdAt: -1 } });
                break;
        }

        pipeline.push({
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: Number(limit) },
                    {
                        $project: {
                            listingId: 1, make: 1, model: 1, year: 1, trim: 1, mileage: 1,
                            transmission: 1, fuelType: 1, images: 1, currentBid: 1,
                            startingBidPrice: 1, buyNowPrice: 1, effectivePrice: 1,
                            auctionStatus: 1, auctionStartDateTime: 1, auctionEndDateTime: 1,
                            canceledAt: 1, emirate: 1, city: 1, totalBids: 1, priceType: 1,
                            overallCondition: 1,
                            'sellerInfo.businessName': 1,
                            'sellerInfo.fullName': 1,
                            'sellerInfo.businessDescription': 1,
                            isWatchlisted: { $gt: [{ $size: '$watchlistMatch' }, 0] }
                        }
                    }
                ],
                totalCount: [{ $count: 'count' }]
            }
        });

        const result = await Vehicle.aggregate(pipeline);
        const vehicles = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        return res.status(200).json({
            success: true,
            message: "Auctions fetched",
            data: vehicles,
            pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) }
        });

    } catch (err) {
        console.error("All auctions error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get auction by id
export const getAuctionDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const buyerId = req.user.id;

        const vehicle = await Vehicle.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'sellerId',
                    foreignField: '_id',
                    as: 'sellerInfo'
                }
            },
            { $unwind: { path: '$sellerInfo', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'bids',
                    let: { vId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$vehicleId', '$$vId'] } } },
                        { $match: { status: { $nin: ['withdrawn'] } } },
                        { $sort: { amount: -1 } },
                        { $limit: 4 },
                        { $project: { amount: 1, createdAt: 1 } }
                    ],
                    as: 'recentBids'
                }
            },
            {
                $lookup: {
                    from: 'bids',
                    let: { vId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$vehicleId', '$$vId'] } } },
                        { $match: { status: { $nin: ['withdrawn'] } } },
                        { $count: 'count' }
                    ],
                    as: 'bidCountArr'
                }
            },
            {
                // NAYA
                $lookup: {
                    from: 'bids',
                    let: { vId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$vehicleId', '$$vId'] },
                                        { $eq: ['$bidderId', new mongoose.Types.ObjectId(buyerId)] },
                                        { $eq: ['$status', 'active'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'myActiveBid'
                }
            },
            {
                $lookup: {
                    from: 'watchlists',
                    let: { vId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$userId', new mongoose.Types.ObjectId(buyerId)] } } },
                        { $match: { $expr: { $in: ['$$vId', '$items.vehicleId'] } } }
                    ],
                    as: 'watchlistMatch'
                }
            },
            {
                $project: {
                    listingId: 1, make: 1, model: 1, year: 1, trim: 1, vin: 1,
                    vehicleType: 1, bodyType: 1, mileage: 1, transmission: 1,
                    fuelType: 1, drivetrain: 1, exteriorColor: 1, interiorColor: 1,
                    vehicleDescription: 1, emirate: 1, city: 1, titleStatus: 1,
                    accidentHistory: 1, images: 1,
                    priceType: 1, startingBidPrice: 1, buyNowPrice: 1, reservePrice: 1,
                    currentBid: 1, auctionStatus: 1, auctionStartDateTime: 1,
                    auctionEndDateTime: 1, views: 1,
                    canceledAt: 1, statusAtCancellation: 1, cancellationReason: 1,
                    'sellerInfo.businessName': 1,
                    'sellerInfo.fullName': 1,
                    'sellerInfo.businessDescription': 1,
                    'sellerInfo.createdAt': 1,
                    recentBids: 1,
                    totalBids: { $ifNull: [{ $arrayElemAt: ['$bidCountArr.count', 0] }, 0] },
                    isCurrentHighestBidder: { $gt: [{ $size: '$myActiveBid' }, 0] },
                    myBidId: { $arrayElemAt: ['$myActiveBid._id', 0] },
                    isWatchlisted: { $gt: [{ $size: '$watchlistMatch' }, 0] }
                }
            }
        ]);

        if (!vehicle.length) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        return res.status(200).json({ success: true, vehicle: vehicle[0] });

    } catch (err) {
        console.error('getAuctionDetail error:', err);
        return res.status(500).json({ success: false, message: 'Server Error Occured' });
    }
};

// get lost auctions + lost auct summary
const getBuyerLostSummary = async (buyerId) => {
    const stats = await Bid.aggregate([
        { $match: { bidderId: new mongoose.Types.ObjectId(buyerId), bidderType: 'Buyer' } },
        { $sort: { amount: -1 } },
        { $group: { _id: '$vehicleId', bidDoc: { $first: '$$ROOT' } } },
        { $replaceRoot: { newRoot: '$bidDoc' } },
        {
            $lookup: { from: 'vehicles', localField: 'vehicleId', foreignField: '_id', as: 'vehicle' }
        },
        { $unwind: '$vehicle' },
        {
            $group: {
                _id: null,
                totalConcludedVehicles: {
                    $sum: {
                        $cond: [
                            { $in: ['$vehicle.auctionStatus', ['sold', 'unsold', 'reserve-not-met']] },
                            1, 0
                        ]
                    }
                },
                totalWonVehicles: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
                totalLostVehicles: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $ne: ['$status', 'won'] },
                                    { $ne: ['$status', 'withdrawn'] },
                                    { $in: ['$vehicle.auctionStatus', ['sold', 'unsold', 'reserve-not-met']] }
                                ]
                            }, 1, 0
                        ]
                    }
                },
                totalOutbidVehicles: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ['$status', 'outbid'] }, { $eq: ['$vehicle.auctionStatus', 'sold'] }] },
                            1, 0
                        ]
                    }
                }
            }
        }
    ]);

    // totalBidsPlaced/totalAmountBid — RAW bid-records pe (deduped-vehicles pe nahi), "kitni-baar-bid-lagayi" ka literal count
    const rawStats = await Bid.aggregate([
        { $match: { bidderId: new mongoose.Types.ObjectId(buyerId), bidderType: 'Buyer' } },
        { $group: { _id: null, totalBidsPlaced: { $sum: 1 }, totalAmountBid: { $sum: '$amount' } } }
    ]);

    const s = stats[0] || { totalConcludedVehicles: 0, totalWonVehicles: 0, totalLostVehicles: 0, totalOutbidVehicles: 0 };
    const r = rawStats[0] || { totalBidsPlaced: 0, totalAmountBid: 0 };
    const winRate = s.totalConcludedVehicles > 0
        ? Math.round((s.totalWonVehicles / s.totalConcludedVehicles) * 100)
        : 0;

    return {
        totalLost: s.totalLostVehicles,
        outbid: s.totalOutbidVehicles,
        winRate,
        totalBidsPlaced: r.totalBidsPlaced,
        totalAmountBid: r.totalAmountBid
    };
};

export const getLostAuctions = async (req, res) => {
    try {
        const id = req.user.id;
        const { tab = 'all', page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // tab-wise scope: "outbid" = strict-subset, "all" = broader
        let bidStatusFilter, vehicleStatusFilter;
        if (tab === 'outbid') {
            bidStatusFilter = ['outbid'];
            vehicleStatusFilter = ['sold'];
        } else if (tab === 'reserve-not-met') {
            bidStatusFilter = { $nin: ['won', 'withdrawn'] };
            vehicleStatusFilter = ['reserve-not-met'];
        } else { // 'all'
            bidStatusFilter = { $nin: ['won', 'withdrawn'] };
            vehicleStatusFilter = ['sold', 'unsold', 'reserve-not-met'];
        }

        const matchStage = {
            bidderId: new mongoose.Types.ObjectId(id),
            bidderType: 'Buyer',
            status: Array.isArray(bidStatusFilter) ? { $in: bidStatusFilter } : bidStatusFilter
        };

        const basePipeline = [
            { $match: matchStage },
            { $sort: { amount: -1 } },
            // per-vehicle sirf-ek (highest) bid rakho — duplicate-rows-fix
            { $group: { _id: '$vehicleId', bidDoc: { $first: '$$ROOT' } } },
            { $replaceRoot: { newRoot: '$bidDoc' } },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicleId',
                    foreignField: '_id',
                    as: 'vehicle'
                }
            },
            { $unwind: '$vehicle' },
            { $match: { 'vehicle.auctionStatus': { $in: vehicleStatusFilter } } },
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'vehicle.sellerId',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
            // sold-case ke liye actual-winning-bid alag se nikaalo
            {
                $lookup: {
                    from: 'bids',
                    let: { vId: '$vehicleId' },
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ['$vehicleId', '$$vId'] }, { $eq: ['$status', 'won'] }] } } }
                    ],
                    as: 'winningBidDoc'
                }
            },
            { $unwind: { path: '$winningBidDoc', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    vehicleId: 1,
                    listingId: '$vehicle.listingId',
                    make: '$vehicle.make',
                    model: '$vehicle.model',
                    year: '$vehicle.year',
                    images: '$vehicle.images',
                    emirate: '$vehicle.emirate',
                    mileage: '$vehicle.mileage',
                    transmission: '$vehicle.transmission',
                    fuelType: '$vehicle.fuelType',
                    emirate: '$vehicle.emirate',
                    city: '$vehicle.city',
                    auctionStatus: '$vehicle.auctionStatus',
                    auctionEndDateTime: '$vehicle.auctionEndDateTime',
                    sellerBusinessName: '$seller.businessName',
                    yourBid: '$amount',
                    // winningBid: sold->actual-winner-amount, unsold->null, reserve-not-met->currentBid
                    winningBid: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$vehicle.auctionStatus', 'sold'] }, then: '$winningBidDoc.amount' },
                                { case: { $eq: ['$vehicle.auctionStatus', 'reserve-not-met'] }, then: '$vehicle.currentBid' }
                            ],
                            default: null
                        }
                    },
                    resultLabel: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$vehicle.auctionStatus', 'sold'] }, then: 'Outbid' },
                                { case: { $eq: ['$vehicle.auctionStatus', 'unsold'] }, then: 'Auction Unsold' },
                                { case: { $eq: ['$vehicle.auctionStatus', 'reserve-not-met'] }, then: 'Reserve Not Met' }
                            ],
                            default: 'N/A'
                        }
                    }
                }
            },
            { $sort: { auctionEndDateTime: -1 } }
        ];

        const [rows, countResult] = await Promise.all([
            Bid.aggregate([...basePipeline, { $skip: skip }, { $limit: limitNum }]),
            Bid.aggregate([...basePipeline, { $count: 'total' }])
        ]);

        const totalCount = countResult[0]?.total || 0;
        const summary = await getBuyerLostSummary(id);

        return res.status(200).json({
            success: true,
            lostAuctions: rows,
            pagination: { totalCount, currentPage: pageNum, totalPages: Math.ceil(totalCount / limitNum) },
            summary
        });

    } catch (err) {
        console.log("Get buyer lost auctions err :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get upcoming auction date
export const getupcomingAuctionDates = async (req, res) => {
    try {
        const result = await Vehicle.aggregate([
            {
                $match: {
                    adminStatus: 'approved',
                    auctionStatus: 'upcoming',
                    auctionStartDateTime: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$auctionStartDateTime",
                            timezone: "Asia/Dubai"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const data = result.map((item) => ({
            date: item._id,
            count: item.count
        }));

        const totalUpcomingAuctions = data.reduce(
            (total, item) => total + item.count, 0
        );

        return res.status(200).json({
            success: true,
            data,
            totalUpcomingAuctions
        });

    } catch (err) {
        console.log("Get upcoming auction dates error:", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// ================================= USER SIDE

const maskName = (name = '') => {
    if (
        !name ||
        name === 'undefined' ||
        name === 'null' ||
        name.trim() === ''
    ) {
        return 'User';
    }

    return name
        .trim()
        .split(/\s+/)
        .map(word => word[0] + '***')
        .join(' ');
};

// get live auctions
export const getHomeLiveAuctions = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 8, 12);

        const data = await Vehicle.aggregate([
            { $match: { adminStatus: 'approved', auctionStatus: 'live' } },
            { $sort: { auctionEndDateTime: 1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'bids',
                    let: { vid: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$vehicleId', '$$vid'] }, status: { $ne: 'withdrawn' } } },
                        { $count: 'c' },
                    ],
                    as: 'bc',
                }
            },
            {
                $project: {
                    make: 1, model: 1, year: 1, trim: 1, priceType: 1, transmission: 1, fuelType: 1, bodyType: 1,
                    auctionEndDateTime: 1, buyNowPrice: 1, startingBidPrice: 1,
                    currentBid: 1,
                    image: { $arrayElemAt: ['$images.url', 0] },
                    totalBids: { $ifNull: [{ $arrayElemAt: ['$bc.c', 0] }, 0] },
                }
            },
        ]);

        res.status(200).json({
            success: true,
            message: "Live auctions fetched successfully",
            data
        });

    } catch (err) {
        console.log("getHomeLiveAuctions Error :", err)
        res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get sold auctions
export const getHomeSoldedVehicles = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 8, 12);

        const rows = await Vehicle.aggregate([
            {
                $match: {
                    adminStatus: 'approved',
                    auctionStatus: 'sold'
                }
            },

            {
                $sort: {
                    auctionEndDateTime: -1
                }
            },

            {
                $limit: limit
            },

            // Get winning bid
            {
                $lookup: {
                    from: 'bids',
                    let: { vid: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$vehicleId', '$$vid']
                                },
                                status: 'won'
                            }
                        },
                        {
                            $sort: {
                                amount: -1
                            }
                        },
                        {
                            $limit: 1
                        }
                    ],
                    as: 'win'
                }
            },

            {
                $unwind: {
                    path: '$win',
                    preserveNullAndEmptyArrays: true
                }
            },

            // Buyer lookup
            {
                $lookup: {
                    from: 'users',
                    let: {
                        bidderId: '$win.bidderId',
                        bidderType: '$win.bidderType'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$bidderId'] },
                                        { $eq: ['$$bidderType', 'Buyer'] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                fullName: {
                                    $trim: {
                                        input: {
                                            $concat: [
                                                { $ifNull: ['$firstName', ''] },
                                                ' ',
                                                { $ifNull: ['$lastName', ''] }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    as: 'buyerWinner'
                }
            },

            // Seller lookup
            {
                $lookup: {
                    from: 'sellers',
                    let: {
                        bidderId: '$win.bidderId',
                        bidderType: '$win.bidderType'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$bidderId'] },
                                        { $eq: ['$$bidderType', 'Seller'] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                fullName: 1
                            }
                        }
                    ],
                    as: 'sellerWinner'
                }
            },

            {
                $project: {
                    _id: 1, make: 1, model: 1, year: 1, soldOn: 1,
                    image: { $arrayElemAt: ['$images.url', 0] },
                    soldPrice: { $ifNull: ['$win.amount', '$currentBid'] },
                    winnerName: {
                        $ifNull: [
                            { $arrayElemAt: ['$buyerWinner.fullName', 0] },
                            { $arrayElemAt: ['$sellerWinner.fullName', 0] }
                        ]
                    }
                }
            }
        ]);

        const data = rows.map(({ winnerName, ...vehicle }) => ({
            ...vehicle,
            winner: maskName(winnerName)
        }));

        res.status(200).json({
            success: true,
            message: "Sold auctions fetched successfully",
            data
        });

    } catch (err) {
        console.log("getHomeSoldedVehicles Error:", err);

        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get all auctions 

const ENDED = ['sold', 'unsold', 'reserve-not-met'];
const csv = (v) => (v ? String(v).split(',').map(s => s.trim()).filter(Boolean) : []);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const looseRegex = (v) => new RegExp(`^${esc(v).replace(/[-_\s]+/g, '[-_\\s]')}$`, 'i');

export const getPublicAuctions = async (req, res) => {
    try {
        const q = req.query;
        const page = Math.max(parseInt(q.page) || 1, 1);
        const limit = Math.min(parseInt(q.limit) || 10, 24);

        // status: live | upcoming | sold | ended (comma allowed)
        let statuses = csv(q.status).flatMap(s => s === 'ended' ? ENDED : [s]);
        statuses = statuses.filter(s => ['live', 'upcoming', ...ENDED].includes(s));
        if (!statuses.length) statuses = ['live', 'upcoming', ...ENDED];

        const match = { adminStatus: 'approved', auctionStatus: { $in: statuses } };

        const category = csv(q.category);
        if (category.length) match.vehicleType = { $in: category };

        const makes = csv(q.make);
        if (makes.length) match.make = { $in: makes.map(looseRegex) };

        const models = csv(q.model);
        if (models.length) match.model = { $in: models.map(looseRegex) };

        if (q.yearFrom || q.yearTo) {
            match.year = {};
            if (q.yearFrom) match.year.$gte = Number(q.yearFrom);
            if (q.yearTo) match.year.$lte = Number(q.yearTo);
        }

        if (q.maxMileage) match.mileage = { $lte: Number(q.maxMileage) };

        const emirates = csv(q.emirate);
        if (emirates.length) match.emirate = { $in: emirates };

        const enumFilters = {
            transmission: 'transmission',
            fuelType: 'fuelType',
            drivetrain: 'drivetrain',
            color: 'exteriorColor',
            condition: 'overallCondition'
        };

        for (const [param, field] of Object.entries(enumFilters)) {
            const vals = csv(q[param]);
            if (vals.length) match[field] = { $in: vals };
        }

        const looseSearch = (v) => new RegExp(esc(v).replace(/[-_\s]+/g, '[-_\\s]'), 'i');
        if (q.search) {
            const r = looseSearch(String(q.search).trim());
            match.$or = [{ make: r }, { model: r }, { trim: r }];
        }

        const from = q.startFrom ? new Date(q.startFrom) : null;
        const to = q.startTo ? new Date(q.startTo) : null;
        if ((from && !isNaN(from)) || (to && !isNaN(to))) {
            match.auctionStartDateTime = {};
            if (from && !isNaN(from)) match.auctionStartDateTime.$gte = from;
            if (to && !isNaN(to)) match.auctionStartDateTime.$lt = to;
        }

        // ended page - side filter
        if (q.endFrom || q.endTo) {
            match.auctionEndDateTime = {};
            if (q.endFrom) match.auctionEndDateTime.$gte = new Date(q.endFrom);
            if (q.endTo) match.auctionEndDateTime.$lt = new Date(q.endTo);
        }

        const onlyLive = statuses.length === 1 && statuses[0] === 'live';
        const onlyUpcoming = statuses.length === 1 && statuses[0] === 'upcoming';

        const sortMap = {
            ending_soon: { auctionEndDateTime: 1 },
            starting_soon: { auctionStartDateTime: 1 },
            newest: { createdAt: -1 },
            price_low: { displayPrice: 1 },
            price_high: { displayPrice: -1 },
            recently_ended: { auctionEndDateTime: -1 },
        };

        const defaultSort = onlyLive ? sortMap.ending_soon
            : onlyUpcoming ? { auctionStartDateTime: 1 }
                : { auctionEndDateTime: -1 };

        const sort = { ...(sortMap[q.sort] || defaultSort), _id: 1 };

        const [result] = await Vehicle.aggregate([
            { $match: match },
            {
                $addFields: {
                    displayPrice: { $cond: [{ $eq: ['$priceType', 'fixed_price'] }, '$buyNowPrice', { $ifNull: ['$currentBid', '$startingBidPrice'] }] },
                }
            },
            ...(q.minPrice || q.maxPrice ? [{
                $match: {
                    displayPrice: {
                        ...(q.minPrice && { $gte: Number(q.minPrice) }),
                        ...(q.maxPrice && { $lte: Number(q.maxPrice) }),
                    },
                }
            }] : []),
            { $sort: sort },
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: 'bids',
                                let: { vid: '$_id' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$vehicleId', '$$vid'] }, status: { $ne: 'withdrawn' } } },
                                    { $count: 'c' },
                                ],
                                as: 'bc',
                            }
                        },
                        {
                            $project: {
                                make: 1, model: 1, year: 1, trim: 1, vehicleType: 1, bodyType: 1, listingId: 1, featuredListing: 1,
                                drivetrain: 1, views: 1,
                                imageCount: { $size: { $ifNull: ['$images', []] } },
                                transmission: 1, fuelType: 1, mileage: 1, engineSize: 1, emirate: 1, city: 1,
                                priceType: 1, startingBidPrice: 1, buyNowPrice: 1, currentBid: 1,
                                auctionStatus: 1, auctionStartDateTime: 1, auctionEndDateTime: 1, soldOn: 1,
                                image: { $arrayElemAt: ['$images.url', 0] },
                                images: { $map: { input: { $slice: ['$images', 5] }, as: 'i', in: '$$i.url' } },
                                soldPrice: { $cond: [{ $eq: ['$priceType', 'fixed_price'] }, '$buyNowPrice', '$currentBid'] },
                                totalBids: { $ifNull: [{ $arrayElemAt: ['$bc.c', 0] }, 0] },
                            }
                        },
                    ],
                    total: [{ $count: 'c' }],
                }
            },
        ]);

        const total = result.total[0]?.c || 0;

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: {
                page,
                limit,
                total, totalPages: Math.ceil(total / limit)
            },
        });

    } catch (err) {
        console.log("getPublicAuctions Error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get auction detail
export const getPublicAuctionDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        const v = await Vehicle.findOne({ _id: id, adminStatus: 'approved', auctionStatus: { $ne: 'draft' } }).lean();

        if (!v) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            })
        };

        const [seller, bids, totalBids, bidderIds] = await Promise.all([
            Seller.findById(v.sellerId).select('businessName fullName profileImage businessType createdAt').lean(),
            Bid.find({
                vehicleId: v._id,
                status: { $nin: ['withdrawn', 'archived'] }
            }).sort({ amount: -1 }).limit(4).select('amount createdAt bidderId').lean(),

            Bid.countDocuments({ vehicleId: v._id, status: { $nin: ['withdrawn', 'archived'] } }),
            Bid.distinct('bidderId', { vehicleId: v._id, status: { $nin: ['withdrawn', 'archived'] } }),
        ]);

        // recent bids: ended => masked name, warna stable anonymous label
        let recentBids;

        if (ENDED.includes(v.auctionStatus)) {
            const ids = [...new Set(bids.map(b => String(b.bidderId)))];
            const [buyers, sellers] = await Promise.all([
                Buyer.find({ _id: { $in: ids } }).select('firstName lastName').lean(),
                Seller.find({ _id: { $in: ids } }).select('fullName').lean(),
            ]);

            const names = new Map();
            buyers.forEach(b => names.set(String(b._id), `${b.firstName || ''} ${b.lastName || ''}`));
            sellers.forEach(s => names.set(String(s._id), s.fullName));

            recentBids = bids.map(b => ({
                bidder: maskName(names.get(String(b.bidderId))),
                amount: b.amount,
                createdAt: b.createdAt,
            }));
        } else {
            const labels = new Map();
            [...bids].reverse().forEach(b => {
                const k = String(b.bidderId);
                if (!labels.has(k)) labels.set(k, labels.size + 1);
            });

            recentBids = bids.map(b => ({
                label: `Bidder #${labels.get(String(b.bidderId))}`,
                amount: b.amount,
                createdAt: b.createdAt,
            }));
        }

        // check owner for bid btn to hide or not
        const isOwner = !!req.user
            && req.user.role === 'seller'
            && String(v.sellerId) === String(req.user.id);

        let myActiveBid = null;

        if (req.user && !isOwner) {
            const mine = await Bid.findOne({
                vehicleId: v._id,
                bidderId: req.user.id,
                status: 'active'
            }).select('amount').lean();
            if (mine) myActiveBid = { _id: mine._id, amount: mine.amount };
        }

        // don't show private fields
        for (const k of [
            'sellerId', 'vin', 'reviewedBy', 'reviewedAt', 'rejectionReason',
            'canceledByUserId', 'canceledBy', 'reservePrice',
            'cancellationReason', 'statusAtCancellation', 'canceledAt',
            'autoRelist', 'vinDecoded', 'allowBiddersToSave', 'extensionCount', '__v',
        ]) delete v[k];
        v.images = (v.images || []).map(i => ({ url: i.url }));

        res.status(200).json({
            success: true,
            data: {
                ...v,
                sellerInfo: seller ? {
                    name: seller.businessName || seller.fullName,
                    profileImage: seller.profileImage,
                    businessType: seller.businessType,
                    memberSince: seller.createdAt
                } : null,

                recentBids,
                totalBids, bidderCount: bidderIds.length,
                isOwner,
                myActiveBid,
            },
        });

    } catch (err) {
        console.log('getPublicAuctionDetail Error :', err);
        res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get upcoming auction dates
export const getUpcomingAuctionDates = async (req, res) => {
    try {
        const now = new Date();

        const data = await Vehicle.aggregate([
            {
                $match: {
                    adminStatus: 'approved',
                    auctionStatus: 'upcoming',
                    auctionStartDateTime: { $gte: now }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$auctionStartDateTime',
                            timezone: 'Asia/Dubai'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    count: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Upcoming auction dates fetched successfully',
            data
        });

    } catch (err) {
        console.log('getUpcomingAuctionDates Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};