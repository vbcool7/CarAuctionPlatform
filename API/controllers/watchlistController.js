
import mongoose from "mongoose";
import Watchlist from "../models/watchlistModelSchema.js";
import Vehicle from "../models/vehicleModelSchema.js";

// Add / Remove vehicle from watchlist
export const toggleWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.role === "seller" ? "Seller" : "Buyer";

        const { vehicleId } = req.body;

        if (!vehicleId || !mongoose.Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Vehicle ID"
            });
        }

        const vehicle = await Vehicle.findById(vehicleId).select('sellerId');

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        // seller can't watchlist their own vehicle
        if (userType === "Seller" && vehicle.sellerId.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "You cannot watchlist your own vehicle"
            });
        }

        // check already watchlisted or not (read-only check, for decision)
        const existing = await Watchlist.findOne({
            userId,
            userType,
            "items.vehicleId": vehicleId
        });

        if (existing) {
            const updated = await Watchlist.findOneAndUpdate(
                { userId, userType },
                { $pull: { items: { vehicleId } } },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                action: "removed",
                message: "Vehicle removed from watchlist",
                watchlist: updated
            });
        }

        // ADD — atomic $addToSet + upsert (if watchlist doc not exist)
        const updated = await Watchlist.findOneAndUpdate(
            { userId, userType },
            {
                $addToSet: {
                    items: { vehicleId, addedAt: new Date() }
                }
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            action: "added",
            message: "Vehicle added to watchlist",
            watchlist: updated
        });

    } catch (err) {
        console.error("Toggle watchlist error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get My Watchlist
export const getMyWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.role === "seller" ? "Seller" : "Buyer";

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, auctionStatus, priceType, auctionType } = req.query;

        // ==================== Vehicle-level match conditions ====================
        const vehicleMatch = {};

        if (auctionStatus && auctionStatus !== 'all') {
            vehicleMatch['vehicle.auctionStatus'] = auctionStatus;
        }

        if (priceType && priceType !== 'all') {
            vehicleMatch['vehicle.priceType'] = priceType;
        }

        if (auctionType && auctionType !== 'all') {
            vehicleMatch['vehicle.auctionType'] = auctionType;
        }

        if (search) {
            const searchRegex = new RegExp(search.trim(), 'i');
            vehicleMatch.$or = [
                { 'vehicle.make': searchRegex },
                { 'vehicle.model': searchRegex },
                { 'vehicle.vin': searchRegex },
                { 'vehicle.listingId': searchRegex },
            ];
        }

        const pipeline = [
            { $match: { userId: new mongoose.Types.ObjectId(userId), userType } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'vehicles', // actual collection name — confirm karo
                    localField: 'items.vehicleId',
                    foreignField: '_id',
                    as: 'vehicle',
                },
            },
            { $unwind: '$vehicle' },
            ...(Object.keys(vehicleMatch).length ? [{ $match: vehicleMatch }] : []),
            { $sort: { 'items.addedAt': -1 } },
            {
                $facet: {
                    metadata: [{ $count: 'totalCount' }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 0,
                                addedAt: '$items.addedAt',
                                vehicle: {
                                    _id: '$vehicle._id',
                                    listingId: '$vehicle.listingId',
                                    sellerId: '$vehicle.sellerId',
                                    images: '$vehicle.images',
                                    year: '$vehicle.year',
                                    make: '$vehicle.make',
                                    model: '$vehicle.model',
                                    vin: '$vehicle.vin',
                                    bodyType: '$vehicle.bodyType',
                                    exteriorColor: '$vehicle.exteriorColor',
                                    transmission: '$vehicle.transmission',
                                    fuelType: '$vehicle.fuelType',
                                    vehicleType: '$vehicle.vehicleType',
                                    startingBidPrice: '$vehicle.startingBidPrice',
                                    currentBid: '$vehicle.currentBid',
                                    buyNowPrice: '$vehicle.buyNowPrice',
                                    reservePrice: '$vehicle.reservePrice',
                                    priceType: '$vehicle.priceType',
                                    auctionType: '$vehicle.auctionType',
                                    auctionStartDate: '$vehicle.auctionStartDate',
                                    auctionStartTime: '$vehicle.auctionStartTime',
                                    auctionStartDateTime: '$vehicle.auctionStartDateTime',
                                    auctionEndDateTime: '$vehicle.auctionEndDateTime',
                                    auctionStatus: '$vehicle.auctionStatus',
                                },
                            },
                        },
                    ],
                },
            },
        ];

        const result = await Watchlist.aggregate(pipeline);

        const totalCount = result[0]?.metadata[0]?.totalCount || 0;
        const items = result[0]?.data || [];

        return res.status(200).json({
            success: true,
            message: items.length ? "Here is your watchlist items" : "Watchlist is empty",
            count: items.length,
            data: { items },
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit) || 1,
                totalCount,
                limit,
            },
        });

    } catch (err) {
        console.error("Get My Watchlist Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// Clear My Watchlist
export const clearWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.role === "seller" ? "Seller" : "Buyer";

        const watchlist = await Watchlist.findOneAndUpdate(
            { userId, userType },
            { $set: { items: [] } },
            { new: true }
        );

        if (!watchlist) {
            return res.status(404).json({
                success: false,
                message: "Watchlist not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Watchlist cleared successfully"
        });

    } catch (err) {
        console.error("Clear Watchlist Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};