
import mongoose from 'mongoose';
import Seller from '../models/sellerModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Order from '../models/orderModelSchema.js';
import Payout from '../models/payoutModelSchema.js';

// ============================== SELLER

const SALE_FIELDS =
    'orderId listingId vehicleId source amount currency status paymentDueAt paidAt expiredAt canceledAt createdAt buyerId buyerType handover.status handover.confirmedAt';

// Order + payout se seller ko dikhne wala ek status
const displayStatus = (order, payout) => {
    if (order.status === 'pending_payment') return 'pending';
    if (order.status === 'expired') return 'expired';
    if (order.status === 'canceled') return 'cancelled';
    if (order.status === 'paid') return payout?.status === 'paid' ? 'completed' : 'sold';
    return order.status;
};

const buyerName = (b) => {
    if (!b) return 'Buyer';
    return b.fullName || [b.firstName, b.lastName].filter(Boolean).join(' ') || 'Buyer';
};

const PAYOUT_FIELDS = 'orderId payoutId status grossAmount commissionPercent commissionAmount netAmount requestedAt paidAt transferReference';

const shapeSale = (o, payout) => ({
    _id: o._id,
    orderId: o.orderId,
    listingId: o.listingId,
    vehicle: o.vehicleId,
    source: o.source,                       // auction | buy_now
    buyerName: buyerName(o.buyerId),
    amount: o.amount,
    currency: o.currency || 'AED',
    status: displayStatus(o, payout),       // pending | sold | completed | expired | cancelled
    orderStatus: o.status,
    paymentDueAt: o.paymentDueAt,
    paidAt: o.paidAt,
    expiredAt: o.expiredAt,
    canceledAt: o.canceledAt,
    createdAt: o.createdAt,
    handover: o.handover || { status: 'pending' },
    payout: payout
        ? {
            _id: payout._id,
            payoutId: payout.payoutId,
            status: payout.status,
            commissionPercent: payout.commissionPercent,
            commissionAmount: payout.commissionAmount,
            netAmount: payout.netAmount,
            requestedAt: payout.requestedAt,
            paidAt: payout.paidAt,
            transferReference: payout.transferReference,
        }
        : null,
});

// get my sales
export const getMySales = async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const filter = { sellerId };
        if (['auction', 'buy_now'].includes(req.query.source)) filter.source = req.query.source;

        const st = req.query.status;

        if (st === 'pending') filter.status = 'pending_payment';
        else if (st === 'expired') filter.status = 'expired';
        else if (st === 'cancelled') filter.status = 'canceled';
        else if (st === 'sold' || st === 'completed') {
            filter.status = 'paid';
            const paidOrderIds = await Payout.find({ sellerId, status: 'paid' }).distinct('orderId');
            filter._id = st === 'completed' ? { $in: paidOrderIds } : { $nin: paidOrderIds };
        }

        if (typeof req.query.search === 'string' && req.query.search.trim()) {
            const s = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [{ orderId: new RegExp(s, 'i') }, { listingId: new RegExp(s, 'i') }];
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .select(SALE_FIELDS)
                .populate('vehicleId', 'make model year images listingId vin')
                .populate('buyerId', 'firstName lastName fullName')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);

        const payouts = await Payout.find({ orderId: { $in: orders.map((o) => o._id) } })
            .select(PAYOUT_FIELDS).lean();
        const payoutByOrder = new Map(payouts.map((p) => [String(p.orderId), p]));

        return res.status(200).json({
            success: true,
            sales: orders.map((o) => shapeSale(o, payoutByOrder.get(String(o._id)))),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        });

    } catch (err) {
        console.log("getMySales error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get my sales detail
export const getMySaleDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const filter = mongoose.isValidObjectId(id) ? { _id: id } : { orderId: id };

        const order = await Order.findOne({ ...filter, sellerId: req.user.id })
            .select(SALE_FIELDS + ' statusHistory refund.amount refund.refundedAt refund.reason')
            .populate(
                'vehicleId',
                'make model year trim vin mileage listingId bodyType fuelType transmission exteriorColor overallCondition images priceType buyNowPrice startingBidPrice currentBid'
            )
            .populate('buyerId', 'firstName lastName fullName')
            .lean();

        if (!order) return res.status(404).json({ 
            success: false, 
            message: 'Sale not found' 
        });

        const payout = await Payout.findOne({ orderId: order._id })
            .select(PAYOUT_FIELDS + ' history').lean();

        const sale = shapeSale(order, payout);
        sale.timeline = (order.statusHistory || []).map((h) => ({ status: h.status, at: h.at, note: h.note }));
        sale.payoutTimeline = (payout?.history || []).map((h) => ({ status: h.status, at: h.at }));
        sale.refund = order.refund || null;

        return res.status(200).json({ 
            success: true, 
            message: "Sales detail fetched",
            sale 
        });

    } catch (err) {
        console.log("getMySalesDetail error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get my sales summary
export const getMySalesSummary = async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);

        const UAE_MS = 4 * 60 * 60 * 1000;
        const uae = new Date(Date.now() + UAE_MS);
        const monthStart = new Date(Date.UTC(uae.getUTCFullYear(), uae.getUTCMonth(), 1) - UAE_MS);

        const [byStatus, commission, thisMonth, completedCount] = await Promise.all([
            Order.aggregate([
                { $match: { sellerId } },
                { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amount' } } },
            ]),
            Payout.aggregate([
                { $match: { sellerId, status: { $ne: 'canceled' } } },
                { $group: { _id: null, commission: { $sum: '$commissionAmount' }, net: { $sum: '$netAmount' } } },
            ]),
            Order.aggregate([
                { $match: { sellerId, status: 'paid', paidAt: { $gte: monthStart } } },
                { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$amount' } } },
            ]),
            Payout.countDocuments({ sellerId, status: 'paid' }),
        ]);

        const get = (s) => byStatus.find((r) => r._id === s) || { count: 0, total: 0 };
        const paid = get('paid');

        return res.status(200).json({
            success: true,
            summary: {
                currency: 'AED',
                totalSales: paid.count,
                totalSalesAmount: paid.total,
                averageSellingPrice: paid.count ? Math.round((paid.total / paid.count) * 100) / 100 : 0,
                totalCommission: commission[0]?.commission || 0,
                thisMonthSalesCount: thisMonth[0]?.count || 0,
                thisMonthSalesAmount: thisMonth[0]?.total || 0,
                completedCount,
                pending: get('pending_payment'),
                expired: get('expired'),
                cancelled: get('canceled'),
            },
        });

    } catch (err) {
        console.log("getMySalesSummary error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get-dashboard-summary
export const getDashboardSummary = async (req, res) => {
    try {
        const sellerId = new mongoose.Types.ObjectId(req.user.id);
        const DAYS = 30;
        const DAY_MS = 24 * 60 * 60 * 1000;
        const UAE_MS = 4 * 60 * 60 * 1000;
        const since = new Date(Date.now() - (DAYS + 1) * DAY_MS);
 
        const [vehicleRows, payoutRows, dailyRows, recentVehicles, seller] = await Promise.all([
            Vehicle.aggregate([
                { $match: { sellerId } },
                { $group: { _id: '$auctionStatus', count: { $sum: 1 } } },
            ]),

            Payout.aggregate([
                { $match: { sellerId, status: { $ne: 'canceled' } } },
                { $group: { _id: '$status', net: { $sum: '$netAmount' } } },
            ]),

            Payout.aggregate([
                { $match: { sellerId, status: { $ne: 'canceled' }, createdAt: { $gte: since } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Dubai' } },
                        total: { $sum: '$netAmount' },
                    },
                },
            ]),

            Vehicle.find({ sellerId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('make model year images listingId auctionStatus priceType buyNowPrice startingBidPrice currentBid auctionStartDateTime auctionEndDateTime')
                .lean(),
            Seller.findById(sellerId).select('fullName createdAt status accountStatus').lean(),
        ]);
 
        // vehicles
        const byStatus = {};
        let total = 0;
        vehicleRows.forEach((r) => { byStatus[r._id] = r.count; total += r.count; });
 
        // earnings (seller ko net, commission ke baad)
        const net = { on_hold: 0, available: 0, requested: 0, paid: 0 };
        payoutRows.forEach((r) => { net[r._id] = r.net; });
        const pending = net.on_hold + net.available + net.requested;
 
        // last 30 din (UAE date), khali din 0
        const dayMap = new Map(dailyRows.map((d) => [d._id, d.total]));
        const series = [];
        for (let i = DAYS - 1; i >= 0; i--) {
            const key = new Date(Date.now() + UAE_MS - i * DAY_MS).toISOString().slice(0, 10);
            series.push({ date: key, earnings: Math.round((dayMap.get(key) || 0) * 100) / 100 });
        }
 
        return res.status(200).json({
            success: true,
            summary: {
                currency: 'AED',
                vehicles: { total, byStatus },
                earnings: { total: pending + net.paid, pending, paid: net.paid },
                earningsSeries: series,
                recentVehicles,
                account: {
                    fullName: seller?.fullName,
                    since: seller?.createdAt,
                    status: seller?.status,
                    accountStatus: seller?.accountStatus,
                },
            },
        });

    } catch (err) {
        console.error('getDashboardSummary error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Server Error Occured' 
        });
    }
};