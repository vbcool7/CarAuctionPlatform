
import mongoose from "mongoose";
import Payout from '../models/payoutModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import Admin from '../models/adminModelSchema.js';

import { createNotification } from "../services/notificationService.js";

const notifySafe = async (payload) => {
    try {
        await createNotification(payload);
    } catch (err) {
        console.error('[payout] notification failed:', err.message);
    }
};

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message });
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

// get payouts
export const getMyPayouts = async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const filter = { sellerId };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const [payouts, total, sums] = await Promise.all([
            Payout.find(filter)
                .select('-bankSnapshot')
                .populate('vehicleId', 'make model year images')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Payout.countDocuments(filter),
            Payout.aggregate([
                { $match: { sellerId } },
                { $group: { _id: '$status', total: { $sum: '$netAmount' }, count: { $sum: 1 } } }
            ])
        ])

        const summary = { on_hold: 0, available: 0, requested: 0, paid: 0 }
        sums.forEach((s) => { summary[s._id] = s.total; });

        return res.status(200).json({
            success: true,
            payouts,
            summary,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        });

    } catch (err) {
        console.log("getMyPayouts error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// request for payout
export const requestPayout = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) return bad(res, 'Invalid payout id');

        const seller = await Seller.findById(req.user.id)
            .select('status accountStatus accountHolderName bankName ibanNumber accountNumber swiftCode')
            .lean();

        if (!seller || seller.status !== 'approved' || seller.accountStatus === 'suspended') {
            return bad(res, 'Your account is not eligible to request payouts', 403);
        }

        const { accountHolderName, bankName, ibanNumber, accountNumber, swiftCode } = seller;

        if (![accountHolderName, bankName, ibanNumber, accountNumber, swiftCode].every(Boolean)) {
            return bad(res, 'Please complete your bank details before requesting a payout');
        }

        const now = new Date();

        const payout = await Payout.findOneAndUpdate(
            { _id: id, sellerId: req.user.id, status: 'available' },
            {
                $set: {
                    status: 'requested',
                    requestedAt: now,
                    bankSnapshot: { accountHolderName, bankName, ibanNumber, accountNumber, swiftCode }
                },
                $push: {
                    history: {
                        status: 'requested',
                        at: now,
                        by: 'seller',
                        byId: req.user.id,
                        note: 'Payout requested'
                    }
                },
            },
            { new: true }
        ).select('-bankSnapshot').lean();

        if (!payout) {
            const existing = await Payout.findOne({ _id: id, sellerId: req.user.id }).select('status').lean();

            if (!existing) return bad(res, 'Payout not found', 404);
            return bad(res, `Payout cannot be requested (status: ${existing.status})`);
        }

        const admin = await Admin.findOne();

        if (admin) {
            await notifySafe({
                recipientId: admin._id,
                recipientType: 'Admin',
                type: 'payout_requested',
                vehicleId: payout.vehicleId, title: 'Payout requested',
                message: `Seller requested payout ${payout.payoutId} of AED ${payout.netAmount} for ${payout.listingId}.`,
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Payout Requested',
            payout
        });

    } catch (err) {
        console.log("requestPayout error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};