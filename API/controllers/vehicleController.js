
import axios from 'axios';
import mongoose from 'mongoose';

import Vehicle from '../models/vehicleModelSchema.js';
import Admin from '../models/adminModelSchema.js';

import { deleteCloudinaryFiles, deleteStoredFile } from '../utils/cloudinaryUtils.js';
import { getNextListingId } from '../utils/counterHelper.js';
import { createNotification } from '../services/notificationService.js';

// ================================================= SELLER SIDE

export const decodeVin = async (req, res) => {
    const { vin } = req.params;
    try {
        const { data } = await axios.get(
            `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`,
            { timeout: 5000 } // NHTSA free tier kabhi slow hota hai, wizard hang na ho isliye
        );
        const results = data.Results;
        const make = results.find((r) => r.Variable === 'Make')?.Value;
        const model = results.find((r) => r.Variable === 'Model')?.Value;
        const year = results.find((r) => r.Variable === 'Year')?.Value;

        if (!make || !model) return res.json({ decoded: false });
        return res.json({ decoded: true, make, model, year });
    } catch (err) {
        return res.json({ decoded: false });
    }
};

// FormData → all values strings → this helper convert string to Number/Boolean
const toNumber = (v) => (v === undefined || v === null || v === '' ? undefined : Number(v));
const toBool = (v) => v === 'true' || v === true;

export const addVehicle = async (req, res) => {
    try {
        const {
            // Step 1
            vehicleType, vin, make, model, year, trim, bodyType, mileage,
            transmission, fuelType, drivetrain, exteriorColor, interiorColor, vehicleDescription,
            country, emirate, city, zipCode, titleStatus, accidentHistory,
            // Step 2
            overallCondition, mechanicalCondition, interiorCondition, exteriorCondition,
            doors, seats, engineSize, cylinders, keyType, additionalFeatures,
            numberOfKeys, repainted, smokeOdor, petFriendly, paintType, glassCondition,
            tiresCondition, tireBrand, tireSize, seatMaterial, sunroof,
            acHeater, audioSystem, navigation, powerWindows, powerLocks, additionalNotes,
            // Step 5
            startingBidPrice, buyNowPrice, reservePrice, priceType, auctionType,
            auctionStartDate, auctionStartTime, auctionDuration,
            antiSnipingWindow, antiSnipingExtension,
            allowBiddersToSave, shareOnSocialMedia, featuredListing, autoRelist,
            vinDecoded,
        } = req.body;

        const files = req.files || {};

        // Step 4 (next): map req.files.images / req.files.documents to schema shape
        const uploadedImages = (req.files.images || []).map((f) => ({
            url: f.path,
            publicId: f.filename,
            resourceType: 'image',
        }))

        const uploadDocuments = (req.files.documents || []).map((f) => ({
            url: f.path,
            publicId: f.filename,
            resourceType: f.mimetype === 'application/pdf' ? 'raw' : 'image',
            name: f.originalname,
        }))

        // Step 3: whitelist + type-cast + build final payload
        const vehicleData = {
            sellerId: req.user.id,
            listingId: await getNextListingId(),

            // Step 1
            vehicleType, vin, make, model,
            year: toNumber(year),
            trim, bodyType,
            mileage: toNumber(mileage),
            transmission, fuelType, drivetrain, exteriorColor, interiorColor, vehicleDescription,
            country, emirate, city, zipCode, titleStatus, accidentHistory,

            // Step 2
            overallCondition, mechanicalCondition, interiorCondition, exteriorCondition,
            doors, seats, engineSize, cylinders, keyType, additionalFeatures,
            numberOfKeys, repainted, smokeOdor, petFriendly, paintType, glassCondition,
            tiresCondition, tireBrand, tireSize, seatMaterial, sunroof,
            acHeater, audioSystem, navigation, powerWindows, powerLocks, additionalNotes,

            // Step 3 & 4 — files
            images: uploadedImages,
            documents: uploadDocuments,

            // Step 5
            startingBidPrice: toNumber(startingBidPrice),
            buyNowPrice: toNumber(buyNowPrice),
            reservePrice: toNumber(reservePrice),
            priceType, auctionType,
            auctionStartDate,
            auctionStartTime, auctionDuration,
            antiSnipingWindow: toNumber(antiSnipingWindow),
            antiSnipingExtension: toNumber(antiSnipingExtension),
            allowBiddersToSave: toBool(allowBiddersToSave),
            shareOnSocialMedia: toBool(shareOnSocialMedia),
            featuredListing: toBool(featuredListing),
            autoRelist: toBool(autoRelist),
            vinDecoded: toBool(vinDecoded),
        };

        // Step 5 (next): calculate auctionEndDateTime --> in schema pre hook calculate it

        // check if vin auc status - sold | unsold | cancelled then not same vin created
        const existingActive = await Vehicle.findOne({
            vin: vin?.toUpperCase(),
            auctionStatus: { $in: ['draft', 'upcoming', 'live'] }
        });

        if (existingActive) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: 'An active listing already exists for this VIN'
            });
        }

        // Images required 
        if (!uploadedImages.length) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }

        // Year range 
        const yearNum = toNumber(year);
        const currentYear = new Date().getFullYear();
        if (!yearNum || yearNum < 1980 || yearNum > currentYear + 1) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: `Year must be between 1980 and ${currentYear + 1}`
            });
        }

        if (!auctionStartDate || isNaN(new Date(auctionStartDate).getTime())) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({ success: false, message: 'Valid auction start date is required' });
        }

        // auctionStartDate not in the past
        if (new Date(auctionStartDate) < new Date()) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({ success: false, message: 'Auction start date cannot be in the past' });
        }

        // Price logic ----
        const startBid = toNumber(startingBidPrice);

        if (priceType === 'fixed_price') {
            const buyNow = toNumber(buyNowPrice);
            if (!buyNow || buyNow <= 0) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({ success: false, message: 'Buy Now price must be a positive value' });
            }
        }
        if (priceType === 'reserve_price' && toNumber(reservePrice) <= startBid) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({ success: false, message: 'Reserve price must be greater than Starting Bid price' });
        }

        // Step 6 (next): Vehicle.create()
        const vehicle = await Vehicle.create(vehicleData);

        // Notify admin + auction manager
        const adminsAndManagers = await Admin.find({
            role: { $in: ['admin', 'auctionManager'] }
        }).select('_id role');

        for (const recipient of adminsAndManagers) {
            await createNotification({
                recipientId: recipient._id,
                recipientType: 'Admin',
                type: 'vehicle_added',
                vehicleId: vehicle._id,
                title: 'New Vehicle Listing',
                message: `${vehicle.listingId} was added by a seller and is pending review.`
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Vehicle listing created successfully',
            data: vehicle,
        });

    } catch (err) {
        console.log("Add vehicle error :", err);
        if (req.files) {
            await deleteCloudinaryFiles(req.files);
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    };
};

// edit vehicle

const MAX_IMAGES = 15;
const MAX_DOCS = 5;
const MAX_HISTORY = 50;

const TEXT_FIELDS = [
    'vehicleType', 'make', 'model', 'trim', 'bodyType', 'transmission', 'fuelType',
    'drivetrain', 'exteriorColor', 'interiorColor', 'vehicleDescription',
    'country', 'emirate', 'city', 'zipCode', 'titleStatus', 'accidentHistory',
    'overallCondition', 'mechanicalCondition', 'interiorCondition', 'exteriorCondition',
    'doors', 'seats', 'engineSize', 'cylinders', 'keyType', 'additionalFeatures',
    'repainted', 'smokeOdor', 'petFriendly', 'paintType', 'glassCondition',
    'tiresCondition', 'tireBrand', 'tireSize', 'seatMaterial', 'sunroof',
    'acHeater', 'audioSystem', 'navigation', 'powerWindows', 'powerLocks', 'additionalNotes',
];
const NUMBER_FIELDS = ['year', 'mileage', 'numberOfKeys'];

const parseIds = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v.map(String);
    const s = String(v).trim();
    if (s.startsWith('[')) {
        try { return JSON.parse(s).map(String); } catch { return null; }
    }
    return s.split(',').map((x) => x.trim()).filter(Boolean);
};

const short = (v) => (typeof v === 'string' && v.length > 300 ? v.slice(0, 300) + '…' : v);

const checkSellerEditable = (vehicle) => {
    if (['draft', 'upcoming'].includes(vehicle.auctionStatus)) return null;
    if (vehicle.auctionStatus === 'live') {
        return 'Live auctions cannot be edited. Please contact support.';
    }
    return 'This vehicle cannot be edited at this stage. Please contact support.';
};

export const sellerEditVehicle = async (req, res) => {

    const fail = async (status, message) => {
        await deleteCloudinaryFiles(req.files);
        return res.status(status).json({
            success: false,
            message
        });
    };

    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return fail(404, 'Vehicle not found');

        // ownership: sirf apni vehicle
        const vehicle = await Vehicle.findOne({ _id: id, sellerId: req.user.id }).select('+editHistory');
        if (!vehicle) return fail(404, 'Vehicle not found');

        const blocked = checkSellerEditable(vehicle);
        if (blocked) return fail(400, blocked);

        const prevAdminStatus = vehicle.adminStatus;
        const body = req.body;
        const files = req.files || {};
        const changes = [];

        // ---------- text / number fields ----------
        const fields = [...TEXT_FIELDS, ...NUMBER_FIELDS];
        if (vehicle.auctionStatus === 'draft') fields.push('vin');

        for (const field of fields) {
            if (body[field] === undefined) continue;

            let incoming = typeof body[field] === 'string' ? body[field].trim() : body[field];
            if (field === 'vin') incoming = String(incoming).toUpperCase();

            if (incoming === '') {
                if (Vehicle.schema.path(field).isRequired) return fail(400, `${field} is required`);
                incoming = undefined;
            } else if (NUMBER_FIELDS.includes(field)) {
                incoming = Number(incoming);
                if (!Number.isFinite(incoming) || incoming < 0) {
                    return fail(400, `${field} must be a valid number`);
                }
            }

            const current = vehicle[field];
            if (String(current ?? '') === String(incoming ?? '')) continue;

            changes.push({ field, from: short(current ?? null), to: short(incoming ?? null) });
            vehicle[field] = incoming;
        }

        // ---------- price fields (priceType ke hisaab se) ----------
        const priceFields = vehicle.priceType === 'fixed_price'
            ? ['buyNowPrice']
            : ['startingBidPrice', 'reservePrice'];

        for (const field of priceFields) {
            if (body[field] === undefined) continue;

            const incoming = Number(body[field]);
            if (String(body[field]).trim() === '' || !Number.isFinite(incoming) || incoming <= 0) {
                return fail(400, `${field} must be a positive number`);
            }
            if (vehicle[field] === incoming) continue;

            changes.push({ field, from: vehicle[field] ?? null, to: incoming });
            vehicle[field] = incoming;
        }

        if (
            vehicle.priceType === 'reserve_price' &&
            (vehicle.isModified('reservePrice') || vehicle.isModified('startingBidPrice')) &&
            vehicle.reservePrice <= vehicle.startingBidPrice
        ) {
            return fail(400, 'Reserve price must be greater than Starting Bid price');
        }

        // ---------- year range ----------
        if (vehicle.isModified('year')) {
            const maxYear = new Date().getFullYear() + 1;
            if (vehicle.year < 1980 || vehicle.year > maxYear) {
                return fail(400, `Year must be between 1980 and ${maxYear}`);
            }
        }

        // ---------- VIN duplicate ----------
        if (vehicle.isModified('vin')) {
            const dup = await Vehicle.findOne({
                _id: { $ne: vehicle._id },
                vin: vehicle.vin,
                auctionStatus: { $in: ['draft', 'upcoming', 'live'] },
            }).select('_id');
            if (dup) return fail(400, 'An active listing already exists for this VIN');
            vehicle.vinDecoded = false;
        }

        // ---------- images / documents ----------
        const removeImageIds = parseIds(body.removeImageIds);
        const removeDocIds = parseIds(body.removeDocumentIds);
        if (removeImageIds === null || removeDocIds === null) {
            return fail(400, 'Invalid remove list');
        }

        const removedImages = vehicle.images.filter((i) => removeImageIds.includes(String(i._id)));
        const removedDocs = vehicle.documents.filter((d) => removeDocIds.includes(String(d._id)));

        if (
            removedImages.length !== new Set(removeImageIds).size ||
            removedDocs.length !== new Set(removeDocIds).size
        ) {
            return fail(400, 'Some files to remove were not found on this vehicle');
        }

        const newImages = (files.images || []).map((f) => ({
            url: f.path, publicId: f.filename, resourceType: 'image',
        }));
        const newDocs = (files.documents || []).map((f) => ({
            url: f.path,
            publicId: f.filename,
            resourceType: f.mimetype === 'application/pdf' ? 'raw' : 'image',
            name: f.originalname,
        }));

        const imagesBefore = vehicle.images.length;
        const docsBefore = vehicle.documents.length;
        const imagesAfter = imagesBefore - removedImages.length + newImages.length;
        const docsAfter = docsBefore - removedDocs.length + newDocs.length;

        if (imagesAfter < 1) return fail(400, 'At least one image is required');
        if (imagesAfter > MAX_IMAGES) return fail(400, `Maximum ${MAX_IMAGES} images allowed`);
        if (docsAfter > MAX_DOCS) return fail(400, `Maximum ${MAX_DOCS} documents allowed`);

        const toDelete = [
            ...removedImages.map((i) => ({ publicId: i.publicId, type: i.resourceType || 'image' })),
            ...removedDocs.map((d) => ({ publicId: d.publicId, type: d.resourceType || 'raw' })),
        ];

        if (removedImages.length || newImages.length) {
            vehicle.images = [
                ...vehicle.images.filter((i) => !removeImageIds.includes(String(i._id))).map((i) => i.toObject()),
                ...newImages,
            ];
            changes.push({
                field: 'images',
                from: `${imagesBefore} images`,
                to: `${imagesAfter} images (-${removedImages.length}, +${newImages.length})`,
            });
        }

        if (removedDocs.length || newDocs.length) {
            vehicle.documents = [
                ...vehicle.documents.filter((d) => !removeDocIds.includes(String(d._id))).map((d) => d.toObject()),
                ...newDocs,
            ];
            changes.push({
                field: 'documents',
                from: `${docsBefore} documents`,
                to: `${docsAfter} documents (-${removedDocs.length}, +${newDocs.length})`,
            });
        }

        // ---------- koi change nahi ----------
        if (!changes.length) return fail(400, 'No changes');

        // ---------- hamesha pending ----------
        if (prevAdminStatus !== 'pending') {
            changes.push({ field: 'adminStatus', from: prevAdminStatus, to: 'pending' });
            vehicle.adminStatus = 'pending';
        }

        // ---------- editHistory (max 50) ----------
        vehicle.editHistory.push({ byRole: 'seller', byId: req.user.id, changes });
        if (vehicle.editHistory.length > MAX_HISTORY) {
            vehicle.editHistory.splice(0, vehicle.editHistory.length - MAX_HISTORY);
        }

        await vehicle.save({ validateModifiedOnly: true });

        await Promise.all(toDelete.map((f) => deleteStoredFile(f.publicId, f.type)));

        // ---------- notification: sirf jab pending nahi tha ----------
        if (prevAdminStatus !== 'pending') {
            try {
                const recipients = await Admin.find({
                    role: { $in: ['admin', 'auctionManager'] },
                }).select('_id');

                const label = prevAdminStatus === 'rejected' ? 'resubmitted after rejection' : 'edited';

                for (const r of recipients) {
                    await createNotification({
                        recipientId: r._id,
                        recipientType: 'Admin',
                        type: 'vehicle_resubmitted',
                        vehicleId: vehicle._id,
                        title: 'Vehicle Resubmitted for Review',
                        message: `${vehicle.listingId} was ${label} by the seller and is pending review.`,
                    });
                }
            } catch (notifErr) {
                console.error('sellerEditVehicle notification failed:', notifErr.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: prevAdminStatus === 'pending'
                ? 'Vehicle updated successfully'
                : 'Vehicle updated and sent for review',
            changedFields: changes.map((c) => c.field),
            adminStatus: vehicle.adminStatus,
        });

    } catch (err) {
        console.log('sellerEditVehicle error :', err);
        await deleteCloudinaryFiles(req.files);

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// stats - vehicles
export const getVehicleStats = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const [totalVehicles, pendingApproval, activeListing, upcomingAuctions, soldVehicles] = await Promise.all([
            Vehicle.countDocuments({ sellerId }),
            Vehicle.countDocuments({ sellerId, adminStatus: "pending" }),
            Vehicle.countDocuments({ sellerId, auctionStatus: "live" }),
            Vehicle.countDocuments({ sellerId, auctionStatus: "upcoming" }),
            Vehicle.countDocuments({ sellerId, auctionStatus: "sold" })
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalVehicles,
                pendingApproval,
                activeListing,
                upcomingAuctions,
                soldVehicles
            }
        });

    } catch (err) {
        console.log("Vehicle Stats Error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get all seller vehicles
export const getMyVehicles = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, status, auctionType, sortBy } = req.query;

        const match = { sellerId: new mongoose.Types.ObjectId(sellerId) };

        if (status && status !== 'all') {
            match.auctionStatus = status;
        }

        if (auctionType && auctionType !== 'all') {
            match.auctionType = auctionType; // 'live' | 'timed'
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

            // year is a Number field
            if (!isNaN(term)) {
                orConditions.push({ year: Number(term) });
            }

            match.$or = orConditions;
        }

        // sort by - only newest/oldest supported
        const sortStage = sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

        const [vehicles, totalCount] = await Promise.all([
            Vehicle.find(match)
                .sort(sortStage)
                .skip(skip)
                .limit(limit),
            Vehicle.countDocuments(match)
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
            },
            ...(vehicles.length === 0 && { message: 'No vehicles found' })
        });

    } catch (err) {
        console.error("Get My Vehicles Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get by id
export const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id).populate('reviewedBy', 'name role');;

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle Detail not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Here is vehicle detail",
            data: vehicle
        });

    } catch (err) {
        console.error("Get Vehicle By ID Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// ================================================= USER SIDE

const PUBLIC_STATUSES = ['upcoming', 'live', 'sold', 'unsold', 'reserve-not-met']; // draft and canceled are not in public

const csv = (v) => (v ? String(v).split(',').map((s) => s.trim()).filter(Boolean) : []);
const num = (v) => (v !== undefined && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : null);

const ENUM_PARAMS = {
    category: 'vehicleType',
    status: 'auctionStatus',
    transmission: 'transmission',
    fuelType: 'fuelType',
    drivetrain: 'drivetrain',
    exteriorColor: 'exteriorColor',
    condition: 'overallCondition',
};

// get category counts
export const getCategoryCounts = async (req, res) => {
    try {
        const counts = await Vehicle.aggregate([
            { $match: { adminStatus: 'approved', auctionStatus: { $in: PUBLIC_STATUSES } } },
            { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
        ]);

        const result = {};
        counts.forEach(c => { result[c._id] = c.count; });

        return res.status(200).json({
            success: true,
            counts: result
        });

    } catch (err) {
        console.error('getCategoryCounts error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get public vehicle - for vehicle list/filter
export const getPublicVehicles = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        const filter = { adminStatus: 'approved', auctionStatus: { $in: PUBLIC_STATUSES } };

        for (const [param, field] of Object.entries(ENUM_PARAMS)) {
            const values = csv(req.query[param]);
            if (!values.length) continue;

            const allowed = field === 'auctionStatus' ? PUBLIC_STATUSES : Vehicle.schema.path(field).enumValues;
            const invalid = values.filter((v) => !allowed.includes(v));

            if (invalid.length) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid ${param}: ${invalid.join(', ')}`
                });
            }
            filter[field] = { $in: values };
        }

        const makes = csv(req.query.make);
        const models = csv(req.query.model);
        if (makes.length) filter.make = { $in: makes };
        if (models.length) filter.model = { $in: models };

        const range = (field, min, max) => {
            const r = {};
            if (min !== null) r.$gte = min;
            if (max !== null) r.$lte = max;
            if (Object.keys(r).length) filter[field] = r;
        };
        range('year', num(req.query.yearMin), num(req.query.yearMax));
        range('mileage', num(req.query.mileageMin), num(req.query.mileageMax));

        const [vehicles, total] = await Promise.all([
            Vehicle.find(filter)
                .collation({ locale: 'en', strength: 2 })
                .select('listingId vehicleType fuelType engineSize make model year mileage images currentBid startingBidPrice buyNowPrice priceType auctionType auctionStatus auctionStartDateTime auctionEndDateTime emirate')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Vehicle.countDocuments(filter).collation({ locale: 'en', strength: 2 }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Vehicles data successfully fetched",
            data: vehicles,
            total, page,
            pages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.log("getPublicVehicles error :", err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get filter option - vehicle list
export const getFilterOptions = async (req, res) => {
    try {
        const base = { adminStatus: 'approved', auctionStatus: { $in: PUBLIC_STATUSES } };

        const [makes, ranges] = await Promise.all([
            Vehicle.aggregate([
                { $match: base },
                { $group: { _id: '$make', models: { $addToSet: '$model' } } },
                { $sort: { _id: 1 } },
            ]),

            Vehicle.aggregate([
                { $match: base },
                { $group: { _id: null, yearMin: { $min: '$year' }, yearMax: { $max: '$year' }, mileageMax: { $max: '$mileage' } } },
            ]),
        ]);

        return res.json({
            success: true,
            message: "Apply filter options",
            makes: makes.map((m) => ({ make: m._id, models: m.models.sort() })),
            ranges: ranges[0] || null,
        });

    } catch (err) {
        console.log("getFilterOptions error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get public stats - home (after search bar)
export const getPublicStats = async (req, res) => {
    try {
        const rows = await Vehicle.aggregate([
            { $match: { adminStatus: 'approved', auctionStatus: { $in: PUBLIC_STATUSES } } },
            { $group: { _id: '$auctionStatus', count: { $sum: 1 } } },
        ]);

        const by = Object.fromEntries(rows.map((r) => [r._id, r.count]));
        const live = by.live || 0;
        const upcoming = by.upcoming || 0;
        const ended = (by.sold || 0) + (by.unsold || 0) + (by['reserve-not-met'] || 0);

        return res.status(200).json({
            success: true,
            message: "Here is data",
            stats: {
                live,
                upcoming,
                ended,
                total: live + upcoming + ended
            },
        });

    } catch (err) {
        console.log("getPublicStats error : ", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};