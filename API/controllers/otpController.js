
import OTP from '../models/otpModelSchema.js';
import sendEmail from '../utils/sendEmail.js';
import Buyer from '../models/buyerModelSchema.js';

export const sentOTP = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({
                success: false,
                message: "Email and Role are required"
            });
        }

        const Model = Buyer;

        if (role !== "buyer") {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const existingAccount = await Model.findOne({ email });
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
        const { email, otp, role } = req.body;

        const storedOtpDetails = await OTP.findOne({ email }).sort({ createdAt: -1 });

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