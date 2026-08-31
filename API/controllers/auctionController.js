
import Bid from '../models/bidModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';

import { UAE_UTC_OFFSET_HOURS, parseTime12h } from '../models/vehicleModelSchema.js';

// Moves upcoming auctions to live when start time arrives
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

// API wrapper for manual auction status testing
// export const updateAuctionStatuses = async (req, res) => {
//     try {
//         const updatedCount = await runAuctionStatusUpdate();
//         return res.status(200).json({
//             success: true,
//             message: `${updatedCount} vehicle(s) moved to live`,
//             updatedCount
//         });

//     } catch (err) {
//         console.log("Auction Updated Status Err :", err);
//         res.status(500).json({
//             success: false,
//             message: "Server Error Occured"
//         });
//     }
// };

// Moves live auctions to sold/unsold/reserve-not-met when end time passes
export const runAuctionEndUpdate = async () => {
    const now = new Date();

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

        if (!winningBid) {
            vehicle.auctionStatus = 'unsold';
        } else if (vehicle.currentBid < vehicle.reservePrice) {
            vehicle.auctionStatus = 'reserve-not-met';
        } else {
            vehicle.auctionStatus = 'sold';
            winningBid.status = 'won';
            await winningBid.save();
        }

        await vehicle.save();
        updatedCount++;
    }
    return updatedCount;
};

// API wrapper for manual auction estatus testing
export const updateAuctionStatuses = async (req, res) => {
    try {
        const liveCount = await runAuctionStatusUpdate();
        const closedCount = await runAuctionEndUpdate();

        return res.status(200).json({
            success: true,
            message: 'Auction statuses updated',
            movedToLive: liveCount,
            closed: closedCount
        });
    } catch (error) {
        console.error('updateAuctionStatuses error:', error);
        return res.status(500).json({ success: false, message: 'Server Error Occured' });
    }
};


// get seller vehicles that are in auction stage (approved + has auctionStatus)
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

        res.status(200).json({
            success: true,
            message: "Here is your auction detail",
            data: vehicle
        });
    } catch (err) {
        console.error("Get My Auction Detail Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};