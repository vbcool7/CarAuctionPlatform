
import mongoose from 'mongoose';
import Order, { PAYMENT_WINDOW_MS } from '../models/orderModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';

import { createNotification } from '../services/notificationService.js';

const notifySafe = async (payload) => {
    try {
        await createNotification(payload);
    } catch (err) {
        console.error('buyNow notification failed:', err.message);
    }
};


// SELLER + BUYER : Buy Now (only priceType = fixed_price)
// Car turant 'pending_payment' me chali jati hai (dusre buyers ke liye hold) + 48h ka Order.
// 'sold' payment success ke baad hoga (Step 3C).
export const buyNow = async (req, res) => {
    try {
        const { vehicleId } = req.body || {};
        const userId = req.user.id;

        let buyerType;
        if (req.user.role === 'buyer') buyerType = 'Buyer';
        else if (req.user.role === 'seller') buyerType = 'Seller';
        else return res.status(400).json({ success: false, message: 'Invalid role' });

        if (!mongoose.isValidObjectId(vehicleId)) {
            return res.status(400).json({ success: false, message: 'Valid vehicleId is required' });
        }

        // buyer approved + active hona chahiye (authMiddleware buyer ka DB check nahi karta)
        if (buyerType === 'Buyer') {
            const buyer = await Buyer.findById(userId).select('status accountStatus').lean();
            if (!buyer || buyer.status !== 'approved' || buyer.accountStatus === 'suspended') {
                return res.status(403).json({ success: false, message: 'Your account is not eligible to buy' });
            }
        }

        const vehicle = await Vehicle.findOne({ _id: vehicleId, adminStatus: 'approved' })
            .select('sellerId listingId priceType buyNowPrice auctionStatus auctionEndDateTime')
            .lean();

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        if (buyerType === 'Seller' && String(vehicle.sellerId) === String(userId)) {
            return res.status(400).json({ success: false, message: 'Sellers cannot buy their own vehicle' });
        }
        if (vehicle.priceType !== 'fixed_price') {
            return res.status(400).json({ success: false, message: 'Buy Now is only available for fixed price vehicles' });
        }
        if (vehicle.auctionStatus !== 'live') {
            return res.status(409).json({ success: false, message: 'This vehicle is not available for purchase' });
        }

        // ek buyer ka ek hi pending Buy Now
        const alreadyPending = await Order.exists({
            buyerId: userId, source: 'buy_now', status: 'pending_payment',
        });
        if (alreadyPending) {
            return res.status(409).json({
                success: false,
                message: 'You already have a pending Buy Now purchase. Complete or wait for it to expire first.',
            });
        }

        // ---- ATOMIC: sirf ek buyer car ko hold kar sakta hai ----
        const now = new Date();
        const claimed = await Vehicle.findOneAndUpdate(
            {
                _id: vehicleId,
                adminStatus: 'approved',
                priceType: 'fixed_price',
                auctionStatus: 'live',
                auctionEndDateTime: { $gt: now },
            },
            { $set: { auctionStatus: 'pending_payment' } },
            { new: false }
        ).select('_id').lean();

        if (!claimed) {
            return res.status(409).json({ success: false, message: 'This vehicle is no longer available' });
        }

        const dueAt = new Date(Date.now() + PAYMENT_WINDOW_MS);
        let order;
        try {
            order = await Order.create({
                vehicleId: vehicle._id,
                listingId: vehicle.listingId,
                sellerId: vehicle.sellerId,
                buyerId: userId,
                buyerType,
                source: 'buy_now',
                amount: vehicle.buyNowPrice,
                paymentDueAt: dueAt,
                statusHistory: [{
                    status: 'pending_payment',
                    by: 'buyer',
                    note: `Buy Now started at AED ${vehicle.buyNowPrice}`,
                }],
            });
        } catch (orderErr) {
            // Order nahi bana: car ko wapas live karo
            await Vehicle.updateOne(
                { _id: vehicleId, auctionStatus: 'pending_payment' },
                { $set: { auctionStatus: 'live' } }
            );

            if (orderErr?.code === 11000) {
                return res.status(409).json({ success: false, message: 'You already have a pending Buy Now purchase, or this vehicle was just taken' });
            }
            throw orderErr;
        }

        const dueText = dueAt.toLocaleString('en-GB', { timeZone: 'Asia/Dubai' });

        await notifySafe({
            recipientId: userId,
            recipientType: buyerType,
            type: 'payment_pending',
            vehicleId: vehicle._id,
            title: 'Complete your purchase',
            message: `${vehicle.listingId} is reserved for you at AED ${vehicle.buyNowPrice}. Complete payment before ${dueText} (UAE time).`,
        });

        await notifySafe({
            recipientId: vehicle.sellerId,
            recipientType: 'Seller',
            type: 'payment_pending',
            vehicleId: vehicle._id,
            title: 'Buy Now started',
            message: `A buyer started Buy Now for ${vehicle.listingId} (AED ${vehicle.buyNowPrice}). Waiting for payment.`,
        });

        return res.status(201).json({
            success: true,
            message: 'Vehicle reserved. Complete the payment within 48 hours.',
            order: {
                _id: order._id,
                orderId: order.orderId,
                amount: order.amount,
                currency: order.currency,
                status: order.status,
                paymentDueAt: order.paymentDueAt,
            },
        });

    } catch (err) {
        console.error('buyNow error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};