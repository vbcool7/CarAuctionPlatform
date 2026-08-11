
import OTP from '../models/otpModelSchema.js';
import sendEmail from '../utils/sendEmail.js';
import Buyer from '../models/buyerModelSchema.js';
import Seller from '../models/sellerModelSchema.js';

const getModel = (role) => (role === 'seller' ? Seller : role === 'buyer' ? Buyer : null);

export const sentOTP = async (req, res) => {
    try {
        const { email } = req.body;
        // Default to 'buyer' when role isn't sent — preserves old behavior
        // for any existing buyer frontend calls that never passed role.
        const role = req.body.role || 'buyer';

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const Model = getModel(role);

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        // Seller can already have a draft (incomplete) record from step-by-step
        // registration — only block if a COMPLETE account already exists.
        const existingAccountQuery = role === 'seller'
            ? { email, isComplete: true }
            : { email };

        const existingAccount = await Model.findOne(existingAccountQuery);
        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} already registered. Please login.`
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteOne({ email, role });
        await OTP.create({ email, otp, role });

        const subject = "Email Verification OTP";
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2>${role.toUpperCase()} Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #D97706;">${otp}</h1>
                <p>This code will expire in 30 minutes.</p>
            </div>
        `;

        await sendEmail(email, subject, html);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (err) {
        console.error("OTP Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Same fallback as sentOTP — old buyer calls without role still work.
        const role = req.body.role || 'buyer';

        const Model = getModel(role);

        if (!Model) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const storedOtpDetails = await OTP.findOne({ email, role }).sort({ createdAt: -1 });

        if (!storedOtpDetails) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found!"
            });
        }

        if (String(storedOtpDetails.otp).trim() !== String(otp).trim()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        storedOtpDetails.verified = true;
        await storedOtpDetails.save();

        // NOTE: phone is verified via the same email OTP for now (no SMS
        // gateway yet). When real SMS/phone OTP is added later, decouple
        // isPhoneVerified from this flow.
        await Model.findOneAndUpdate(
            { email },
            { isEmailVerified: true, isPhoneVerified: true }
        );

        res.status(200).json({
            success: true,
            message: "Email verified successfully!"
        });

    } catch (err) {
        console.error("OTP Error:", err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};