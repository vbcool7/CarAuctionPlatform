
import axios from 'axios';
import Vehicle from '../models/vehicleModelSchema.js';

import { deleteCloudinaryFiles } from '../utils/cloudinaryUtils.js';
import { getNextListingId } from '../utils/counterHelper.js';

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

// =========================== SELLER SIDE

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

        const [vehicles, totalCount] = await Promise.all([
            Vehicle.find({ sellerId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Vehicle.countDocuments({ sellerId })
        ]);

        if (vehicles.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                vehicles: [],
                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalCount: 0,
                    limit
                },
                message: "No vehicles found"
            });
        }

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
        console.error("Get My Vehicles Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get vehcile by id
export const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id);

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