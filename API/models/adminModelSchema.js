
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    profilePhoto: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        default: "admin"
    },
},
    { timestamps: true }
)

export default mongoose.model("Admin", adminSchema);