
import PDFDocument from 'pdfkit';
import mongoose from 'mongoose';
import Order from '../models/orderModelSchema.js';
import Payout from '../models/payoutModelSchema.js';

const VEHICLE_FIELDS =
    'make model year trim vin listingId mileage fuelType transmission bodyType exteriorColor';

const SELLER_FIELDS =
    'fullName businessName email phone vatNumber licenseNumber country emirate city area streetAddress building poBox zipCode';

const BUYER_FIELDS =
    'firstName lastName fullName companyName email mobile phone vatNumber country emirate city address pincode';

const getOrderFilter = (id) =>
    mongoose.isValidObjectId(id) ? { _id: id } : { orderId: id };

const buyerTypeFromRole = (role) => {
    if (role === 'buyer') return 'Buyer';
    if (role === 'seller') return 'Seller';
    return null;
};

// make filename safe
const cleanFilenamePart = (value) =>
    String(value || 'order').replace(/[^a-zA-Z0-9_-]/g, '_');

const formatMoney = (amount, currency = 'AED') => {
    const number = Number(amount);
    if (!Number.isFinite(number)) return null;

    return `${currency} ${number.toLocaleString('en-AE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (value) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeZone: 'Asia/Dubai',
    }).format(date);
};

// text formatter
const titleCase = (value) =>
    String(value || '')
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const addField = (doc, label, value) => {
    if (value === undefined || value === null || String(value).trim() === '') return;

    const x = doc.page.margins.left + 10;
    const y = doc.y;

    doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#64748B')
        .text(`${label}: `, x, y, {
            continued: true,
        });

    doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#334155')
        .text(String(value));

    doc.moveDown(0.3);
};

const addAddress = (doc, person) => {
    if (!person) return;

    const address = [
        person.streetAddress || person.address,
        person.building,
        person.area,
        person.city,
        person.emirate && titleCase(person.emirate),
        person.country && titleCase(person.country),
        person.poBox || person.pincode || person.zipCode,
    ].filter(Boolean).join(', ');

    if (address) addField(doc, 'Address', address);
};

const startPdf = (res, filename, title, reference) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename="${cleanFilenamePart(filename)}.pdf"`
    );

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    const { width, margins } = doc.page;
    const left = margins.left;
    const right = width - margins.right;

    // BidDrive logo
    doc.font('Helvetica-Bold').fontSize(21);

    const bidWidth = doc.widthOfString('Bid');
    const driveWidth = doc.widthOfString('Drive');
    const logoX = right - bidWidth - driveWidth;

    doc.fillColor('#0B1E3D')
        .text('Bid', logoX, 32, { lineBreak: false });

    doc.fillColor('#D97706')
        .text('Drive', logoX + bidWidth, 32, { lineBreak: false });

    // Divider
    doc.moveTo(left, 68)
        .lineTo(right, 68)
        .lineWidth(2)
        .strokeColor('#D97706')
        .stroke();

    // Title
    doc.fillColor('#0B1E3D')
        .font('Helvetica-Bold')
        .fontSize(19)
        .text(title.toUpperCase(), left, 84, {
            lineBreak: false,
        });

    // Reference
    doc.fillColor('#64748B')
        .font('Helvetica')
        .fontSize(9)
        .text(`Reference: ${reference}`, left, 111, {
            lineBreak: false,
        });

    // Start content close to reference
    doc.y = 132;

    return doc;
};

const addBidDriveWatermark = (doc) => {
    const { width, height } = doc.page;
    const originalX = doc.x;
    const originalY = doc.y;

    doc.save();

    doc.opacity(0.07);
    doc.fillColor('#0B1E3D');
    doc.font('Helvetica-Bold');
    doc.fontSize(48);

    doc.rotate(-35, {
        origin: [width / 2, height / 2],
    });

    doc.text('BidDrive', width / 2 - 125, height / 2, {
        lineBreak: false,
    });

    doc.restore();

    // Restore content cursor
    doc.x = originalX;
    doc.y = originalY;
};

const addSectionHeading = (doc, title) => {
    const x = doc.page.margins.left;
    const width =
        doc.page.width -
        doc.page.margins.left -
        doc.page.margins.right;
    
    doc.moveDown(0.4);

    const y = doc.y;

    doc.save();

    doc.roundedRect(x, y, width, 25, 4)
        .fill('#F1F5F9');

    doc.fillColor('#0B1E3D')
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(title, x + 10, y + 6, {
            lineBreak: false,
        });

    doc.restore();

    doc.x = x;
    doc.y = y + 35;
};

const addVehicleDetails = (doc, vehicle, listingId) => {
    if (!vehicle) return;

    addSectionHeading(doc, 'Vehicle Details');

    const vehicleName = [
        vehicle.year,
        vehicle.make,
        vehicle.model,
        vehicle.trim,
    ].filter(Boolean).join(' ');

    addField(doc, 'Vehicle', vehicleName);
    addField(doc, 'Listing ID', listingId || vehicle.listingId);
    addField(doc, 'VIN', vehicle.vin);
    addField(doc, 'Mileage', vehicle.mileage);
    addField(doc, 'Fuel Type', titleCase(vehicle.fuelType));
    addField(doc, 'Transmission', titleCase(vehicle.transmission));
    addField(doc, 'Body Type', titleCase(vehicle.bodyType));
    addField(doc, 'Exterior Color', vehicle.exteriorColor);
    doc.moveDown(0.5);
};

// buyer invoice
export const downloadBuyerInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const buyerType = buyerTypeFromRole(req.user.role);

        if (!buyerType) {
            return res.status(404).json({
                success: false,
                message: "Buyer Account Required"
            });
        }

        const order = await Order.findOne({ ...getOrderFilter(id), buyerId: req.user.id, buyerType })
            .populate({
                path: 'vehicleId',
                select: VEHICLE_FIELDS,
            })
            .populate({
                path: 'sellerId',
                select: SELLER_FIELDS,
            })
            .populate({
                path: 'buyerId',
                model: buyerType,
                select: BUYER_FIELDS,
            })
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status !== 'paid') {
            return res.status(409).json({
                success: false,
                message: "Invoice is available after payment is completed"
            });
        }

        const doc = startPdf(res, `invoice-${order.orderId}`, 'Purchase Invoice', order.orderId);

        addBidDriveWatermark(doc);

        const buyer = order.buyerId;
        const seller = order.sellerId;
        const buyerName =
            buyer?.companyName ||
            buyer?.fullName ||
            [buyer?.firstName, buyer?.lastName].filter(Boolean).join(' ');

        addSectionHeading(doc, 'Seller');
        addField(doc, 'Name', seller?.businessName || seller?.fullName);
        addField(doc, 'Email', seller?.email);
        addField(doc, 'Phone', seller?.phone);
        addField(doc, 'VAT Number', seller?.vatNumber);
        addAddress(doc, seller);

        addSectionHeading(doc, 'Buyer');
        addField(doc, 'Name', buyerName);
        addField(doc, 'Email', buyer?.email);
        addField(doc, 'Phone', buyer?.mobile || buyer?.phone);
        addField(doc, 'VAT Number', buyer?.vatNumber);
        addAddress(doc, buyer);

        addVehicleDetails(doc, order.vehicleId, order.listingId);

        addSectionHeading(doc, 'Payment');
        addField(doc, 'Order ID', order.orderId);
        addField(doc, 'Payment Status', titleCase(order.status));
        addField(doc, 'Paid On', formatDate(order.paidAt));
        addField(doc, 'Sale Type', titleCase(order.source));
        addField(doc, 'Amount Paid', formatMoney(order.amount, order.currency));

        doc.end();

    } catch (err) {
        console.error('downloadBuyerInvoice error:', err);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Could not generate invoice',
            });
        }
    }
};

// seller invoice
export const downloadSellerSaleStatement = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({ ...getOrderFilter(id), sellerId: req.user.id })
            .populate({
                path: 'vehicleId',
                select: VEHICLE_FIELDS,
            })
            .populate({
                path: 'sellerId',
                select: SELLER_FIELDS,
            })
            .populate({
                path: 'buyerId',
                select: BUYER_FIELDS,
            })
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found',
            });
        }

        if (order.status !== 'paid') {
            return res.status(409).json({
                success: false,
                message: 'Statement is available after buyer payment is completed',
            });
        }

        const payout = await Payout.findOne({ orderId: order._id }).lean();
        const doc = startPdf(
            res,
            `sale-statement-${order.orderId}`,
            'Seller Sale Statement',
            order.orderId
        );

        addBidDriveWatermark(doc);

        const seller = order.sellerId;
        const buyer = order.buyerId;
        const buyerName =
            buyer?.companyName ||
            buyer?.fullName ||
            [buyer?.firstName, buyer?.lastName].filter(Boolean).join(' ');

        addSectionHeading(doc, 'Seller Details');
        addField(doc, 'Name', seller?.businessName || seller?.fullName);
        addField(doc, 'Email', seller?.email);
        addField(doc, 'Phone', seller?.phone);
        addField(doc, 'VAT Number', seller?.vatNumber);
        addAddress(doc, seller);

        addSectionHeading(doc, 'Sale Details');
        addField(doc, 'Buyer', buyerName);
        addField(doc, 'Sale Date', formatDate(order.paidAt));
        addField(doc, 'Sale Type', titleCase(order.source));
        addField(doc, 'Payment Status', titleCase(order.status));

        addVehicleDetails(doc, order.vehicleId, order.listingId);

        addSectionHeading(doc, 'Payout Summary');
        addField(doc, 'Gross Sale Amount', formatMoney(
            payout?.grossAmount ?? order.amount,
            payout?.currency || order.currency
        ));

        addField(
            doc,
            'Platform Fee',
            payout
                ? `-${formatMoney(payout.commissionAmount, payout.currency || order.currency)} (${payout.commissionPercent}%)`
                : null
        );

        addField(doc, 'Net Payout', payout
            ? formatMoney(payout.netAmount, payout.currency || order.currency)
            : null);
        addField(doc, 'Payout ID', payout?.payoutId);
        addField(doc, 'Payout Status', titleCase(payout?.status));
        addField(doc, 'Transfer Reference', payout?.transferReference);
        addField(doc, 'Transferred On', formatDate(payout?.paidAt));

        doc.end();

    } catch (err) {
        console.error('downloadSellerSaleStatement error:', err);

        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Could not generate sale statement',
            });
        }
    }
};