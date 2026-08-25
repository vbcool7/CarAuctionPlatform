
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },
        listingId: { type: String, unique: true },

        // ============ 1st-step
        vehicleType: {
            type: String,
            enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'pickup_truck', 'van', 'minivan', 'sports_car', 'luxury_car', 'electric_vehicle', 'motorcycle'],
            required: true
        },
        vin: { type: String, required: true, uppercase: true, trim: true },
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        trim: { type: String, },
        bodyType: {
            type: String,
            enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'pickup_truck', 'van', 'minivan', 'roadster', 'crossover'],
            required: true
        },
        mileage: { type: Number, required: true },
        transmission: {
            type: String,
            enum: ['automatic', 'manual', 'cvt', 'semi_automatic'],
            required: true
        },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel', 'electric', 'hybrid', 'plug_in_hybrid', 'cng', 'lpg'],
            required: true
        },
        drivetrain: {
            type: String,
            enum: ['fwd', 'rwd', 'awd', '4wd'],
            required: true
        },
        exteriorColor: {
            type: String,
            enum: ['black', 'white', 'silver', 'grey', 'red', 'blue', 'green', 'brown', 'gold', 'beige', 'orange', 'yellow', 'purple', 'other'],
            required: true
        },
        interiorColor: {
            type: String,
            enum: ['black', 'white', 'grey', 'beige', 'brown', 'tan', 'red', 'blue', 'other'],
            required: true
        },
        vehicleDescription: { type: String, required: true },
        country: {
            type: String,
            enum: ['united_arab_emirates'],
            required: true
        },
        emirate: {
            type: String,
            enum: ['abu_dhabi', 'dubai', 'sharjah', 'ajman', 'umm_al_quwain', 'ras_al_khaimah', 'fujairah'],
            required: true
        },
        city: { type: String, required: true },
        zipCode: { type: String },
        titleStatus: {
            type: String,
            enum: ['clean', 'salvage', 'rebuilt'],
            required: true
        },
        accidentHistory: {
            type: String,
            enum: ["yes", "no", "not_sure"],
            required: true,
        },

        // ============ 2nd-step
        overallCondition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            required: true
        },
        mechanicalCondition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            required: true
        },
        interiorCondition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            required: true
        },
        exteriorCondition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor'],
            required: true
        },
        doors: {
            type: String,
            enum: ['2', '3', '4', '5'],
            required: true
        },
        seats: {
            type: String,
            enum: ['2', '3', '4', '5', '6', '7', '8', '9'],
            required: true
        },
        engineSize: { type: String, required: true },
        cylinders: { type: String },
        keyType: {
            type: String,
            enum: ['standard', 'remote', 'smart_key', 'keyless_entry', 'keyless_start'],
        },
        additionalFeatures: { type: String },
        numberOfKeys: { type: Number },
        repainted: {
            type: String,
            enum: ["yes", "no", "not_sure"]
        },
        smokeOdor: {
            type: String,
            enum: ["yes", "no", "not_sure"]
        },
        petFriendly: {
            type: String,
            enum: ["yes", "no", "not_sure"]
        },
        paintType: {
            type: String,
            enum: ["factory_original", "repainted"]
        },
        glassCondition: {
            type: String,
            enum: ["no_cracks", "minor_cracks", "major_cracks"]
        },
        tiresCondition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor', 'needs_replacement'],
        },
        tireBrand: { type: String },
        tireSize: { type: String },
        seatMaterial: {
            type: String,
            enum: ['fabric', 'leather', 'synthetic_leather', 'suede', 'alcantara', 'vinyl'],
        },
        sunroof: {
            type: String,
            enum: ["yes", "no", "panoramic"]
        },
        acHeater: { type: String },
        audioSystem: { type: String },
        navigation: {
            type: String,
            enum: ["yes", "no", "built_in"]
        },
        powerWindows: {
            type: String,
            enum: ["yes", "no"]
        },
        powerLocks: {
            type: String,
            enum: ["yes", "no"]
        },
        additionalNotes: { type: String },

        // ============ 3rd-step
        images: {
            type: [{ url: String, publicId: String, resourceType: { type: String, default: 'image' } }],
            default: []
        },

        // ============ 4th-step
        documents: [{
            url: { type: String, required: true },
            publicId: { type: String, required: true },
            resourceType: { type: String, default: 'raw' },
            name: { type: String, required: true } // f.originalname
        }],

        // ============ 5th-step
        priceType: {
            type: String,
            enum: ["fixed_price", "reserve_price"]
        },
        startingBidPrice: { type: Number, required: true },
        buyNowPrice: {
            type: Number,
            required: function () { return this.priceType === 'fixed_price'; }
        },
        reservePrice: {
            type: Number,
            required: function () { return this.priceType === 'reserve_price'; }
        },
        auctionType: {
            type: String,
            enum: ["live", "timed"]
        },
        auctionStartDate: { type: Date },
        auctionStartTime: { type: String },
        auctionDuration: { type: String, enum: ["1_day", "3_days", "5_days", "7_days", "14_days"] },
        antiSnipingWindow: { type: Number, default: 2 },    // minutes before end — bid in this window triggers extension
        antiSnipingExtension: { type: Number, default: 2 }, // minutes added to auctionEndDateTime when triggered
        vinDecoded: { type: Boolean, default: false },
        auctionEndDateTime: { type: Date },
        allowBiddersToSave: { type: Boolean, default: false },
        shareOnSocialMedia: { type: Boolean, default: false },
        featuredListing: { type: Boolean, default: false },
        autoRelist: { type: Boolean, default: false },

        currentBid: { type: Number, default: null },
        views: { type: Number, default: 0 },

        adminStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        auctionStatus: {
            type: String,
            enum: ['draft', 'upcoming', 'live', 'sold', 'unsold', 'reserve-not-met', 'canceled'],
            default: 'draft',
        },
        rejectionReason: { type: String },
        reviewedAt: { type: Date },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        canceledBy: {
            type: String,
            enum: ['seller', 'admin', null],
            default: null, // only meaningful when auctionStatus === 'canceled'
        },
    },
    { timestamps: true }
);

// calculate auction time
const DURATION_MS = {
    '1_day': 1 * 24 * 60 * 60 * 1000,
    '3_days': 3 * 24 * 60 * 60 * 1000,
    '5_days': 5 * 24 * 60 * 60 * 1000,
    '7_days': 7 * 24 * 60 * 60 * 1000,
    '14_days': 14 * 24 * 60 * 60 * 1000,
};

const UAE_UTC_OFFSET_HOURS = 4; // HARDCODED — UAE-only platform. Revisit if/when multi-country expansion happens (see `country` field comment).

function parseTime12h(timeStr) {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return null;

    let [, hours, minutes, meridiem] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    meridiem = meridiem.toUpperCase();

    if (hours === 12) hours = 0;
    if (meridiem === 'PM') hours += 12;

    return { hours, minutes };
}

vehicleSchema.pre('save', function () {
    if (this.isModified('auctionStartDate') ||
        this.isModified('auctionStartTime') ||
        this.isModified('auctionDuration')) {

        if (!this.auctionStartDate || !this.auctionStartTime || !this.auctionDuration) {
            throw new Error('auctionStartDate, auctionStartTime, and auctionDuration are required to compute auctionEndDateTime');
        }

        const durationMs = DURATION_MS[this.auctionDuration];
        if (!durationMs) {
            throw new Error(`Invalid auctionDuration: ${this.auctionDuration}`);
        }

        const parsed = parseTime12h(this.auctionStartTime);
        if (!parsed) {
            throw new Error(`Invalid auctionStartTime format: ${this.auctionStartTime}`);
        }

        const startDateTime = new Date(this.auctionStartDate);
        startDateTime.setUTCHours(
            parsed.hours - UAE_UTC_OFFSET_HOURS,
            parsed.minutes,
            0,
            0
        );

        this.auctionEndDateTime = new Date(startDateTime.getTime() + durationMs);
    }
    // no next() call needed — sync function, Mongoose 7+ handles completion automatically
});

export default mongoose.model('Vehicle', vehicleSchema);