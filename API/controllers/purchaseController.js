
import Purchase from '../models/purchaseModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Admin from '../models/adminModelSchema.js';

import { createNotification } from '../services/notificationService.js';
import { getNextPurchaseId } from '../utils/counterHelper.js';

export const buyVehicle = async (req, res) => {
    try {
        const { id } = req.params; // vehicleId
        const buyerId = req.user.id;
        const role = req.user.role; // 'seller' | 'buyer'

        if (!['seller', 'buyer'].includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to purchase'
            });
        }

        const buyerType = role.charAt(0).toUpperCase() + role.slice(1);

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // self-purchase block 
        if (buyerType === 'Seller' && vehicle.sellerId.toString() === buyerId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot purchase your own listing'
            });
        }

        if (vehicle.priceType !== 'fixed_price') {
            return res.status(400).json({
                success: false,
                message: 'This vehicle is not available for direct purchase'
            });
        }

        // atomic status flip — race-safe against simultaneous buy-now clicks
        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { _id: id, auctionStatus: 'live', priceType: 'fixed_price' },
            { $set: { auctionStatus: 'sold' } },
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(400).json({
                success: false,
                message: 'This vehicle is no longer available for purchase'
            });
        }

        const purchase = await Purchase.create({
            purchaseId: await getNextPurchaseId(),
            vehicleId: updatedVehicle._id,
            buyerId,
            buyerType,
            amount: updatedVehicle.buyNowPrice,
        });

        // notification trigger — to seller
        await createNotification({
            recipientId: updatedVehicle.sellerId,
            recipientType: 'Seller',
            type: 'auction_sold',
            vehicleId: updatedVehicle._id,
            title: 'Your vehicle has been sold',
            message: `${updatedVehicle.listingId} was purchased for AED ${updatedVehicle.buyNowPrice}.`,
        });

        // notification trigger — to buyer
        await createNotification({
            recipientId: buyerId,
            recipientType: buyerType,
            type: 'auction_sold',
            vehicleId: updatedVehicle._id,
            title: 'Purchase Succesful',
            message: `You purchased ${updatedVehicle.listingId} for AED ${updatedVehicle.buyNowPrice}.`,
        });

        // notification trigger — to admin
        const admin = await Admin.findOne();
        if (admin) {
            await createNotification({
                recipientId: admin._id,
                recipientType: 'Admin',
                type: 'auction_sold',
                vehicleId: updatedVehicle._id,
                title: 'Vehicle Sold',
                message: `${updatedVehicle.listingId} was sold for AED ${updatedVehicle.buyNowPrice}.`,
            });
        }

    return res.status(201).json({
        success: true,
        message: 'Purchase successful',
        data: purchase,
    });

} catch (err) {
    console.log('Buy vehicle error:', err);
    return res.status(500).json({ success: false, message: 'Server Error Occurred' });
}
};