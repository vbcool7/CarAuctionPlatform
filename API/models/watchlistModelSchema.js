
import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "userType",
        },

        userType: {
            type: String,
            required: true,
            enum: ["Buyer", "Seller"],
        },

        items: [
            {
                vehicleId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Vehicle",
                    required: true,
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
                // don't repeat notification trigger
                notifiedLive: {
                    type: Boolean,
                    default: false,
                },
                notifiedEndingSoon: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true }
);

watchlistSchema.index({ userId: 1, userType: 1 }, { unique: true });

watchlistSchema.index({ "items.vehicleId": 1 });

export default mongoose.model("Watchlist", watchlistSchema);