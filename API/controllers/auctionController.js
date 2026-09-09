
import Admin from '../models/adminModelSchema.js';
import Bid from '../models/bidModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';

import { UAE_UTC_OFFSET_HOURS, parseTime12h } from '../models/vehicleModelSchema.js';
import { createNotification } from '../services/notificationService.js';

// RESERVE PRICE - Moves upcoming auctions to live when start time arrives
export const runAuctionStatusUpdate = async () => {
    const now = new Date();

    // find upcoming vehicles jinka start time aa chuka hai
    const vehiclesToGoLive = await Vehicle.find({
        auctionStatus: "upcoming",
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
            winningBid.status = 'won';
            await winningBid.save();

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
export const getMyAuctions = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {
            sellerId,
            adminStatus: 'approved',
            auctionStatus: { $in: ['upcoming', 'live', 'sold', 'unsold', 'reserve-not-met', 'canceled'] }
        };

        const [vehicles, totalCount] = await Promise.all([
            Vehicle.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Vehicle.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: vehicles.length,
            vehicles,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
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

// auction cancel - admin + seller
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
        vehicle.canceledBy = role; // 'seller' or 'admin'
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