
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Buyer from '../models/buyerModelSchema.js';
import OTP from '../models/otpModelSchema.js';
import sendEmail from '../utils/sendEmail.js';
import { deleteCloudinaryFiles } from '../utils/cloudinaryUtils.js';
import { getNextBuyerId } from '../utils/counterHelper.js';

export const buyerRegistration = async (req, res) => {
    try {
        const frontImageUrl = req.files?.['frontImageUrl']?.[0]?.path;
        const backImageUrl = req.files?.['backImageUrl']?.[0]?.path;
        const selfieImageUrl = req.files?.['selfieImageUrl']?.[0]?.path;
        const documentUrl = req.files?.['documentUrl']?.[0]?.path;
        const landlordIdUrl = req.files?.['landlordIdUrl']?.[0]?.path;

        const {
            firstName, lastName, email, mobile, password, confirmPassword,
            dob, nationality, country, emirate, city, address, pincode,
            buyerType, companyName, registrationNumber, vatNumber,
            identityDocType, addressDocType,
            paymentMethod, termsAccepted
        } = req.body;

        const baseMissing = !firstName || !lastName || !email || !mobile || !password || !confirmPassword ||
            !dob  || !country || !emirate || !city || !address || !buyerType ||
            !identityDocType || !addressDocType || !paymentMethod;

        if (baseMissing) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Please fill all mandatory fields"
            });
        }

        if (password !== confirmPassword) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        // conditional: dealer/business only
        if (['dealer', 'business'].includes(buyerType)) {
            if (!companyName || !registrationNumber) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: "Company name and registration number required for dealer/business"
                });
            }
        }

        // conditional: identity doc uploads
        if (!frontImageUrl || !selfieImageUrl) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Front image and selfie required"
            });
        }
        if (['passport', 'national_id'].includes(identityDocType) && !backImageUrl) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Back image required for passport/national ID"
            });
        }

        // conditional: address doc uploads
        if (!documentUrl) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Address document required"
            });
        }
        if (addressDocType === 'rental_agreement' && !landlordIdUrl) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Landlord ID required for rental agreement"
            });
        }

        const existing = await Buyer.findOne({ $or: [{ email }, { mobile }] });
        if (existing) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Email or mobile already registered"
            });
        }

        const otpRecord = await OTP.findOne({ email, role: 'buyer', verified: true }).sort({ createdAt: -1 });
        if (!otpRecord) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Email not verified. Please verify OTP first."
            });
        }

        if (termsAccepted !== 'true' && termsAccepted !== true) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "You must accept the terms and conditions"
            });
        }

        const validMethods = ['card', 'bank_transfer', 'paypal', 'other'];
        if (!validMethods.includes(paymentMethod)) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({ success: false, message: "Invalid payment method" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const buyer = await Buyer.create({
            buyerId: await getNextBuyerId(),
            firstName, lastName, email, mobile, password: hashedPassword,
            dob, nationality, country, emirate, city, address, pincode,
            buyerType, companyName, registrationNumber, vatNumber,
            identityVerification: { documentType: identityDocType, frontImageUrl, backImageUrl, selfieImageUrl },
            addressVerification: { documentType: addressDocType, documentUrl, landlordIdUrl },
            payment: {
                method: paymentMethod
                // depositAmount, platformFee, paymentStatus, depositRefundable: schema defaults apply
                // do NOT accept these from req.body until a gateway confirms real payment state
            },
            isEmailVerified: true,
            termsAccepted,
            registrationStatus: 'submitted',
            submittedAt: Date.now(),
            status: 'pending'
        });

        await OTP.deleteOne({ _id: otpRecord._id });

        const buyerResponse = buyer.toObject();
        delete buyerResponse.password;

        return res.status(201).json({
            success: true,
            message: "Registered successfully.",
            data: buyerResponse
        });

    } catch (err) {
        if (req.files) await deleteCloudinaryFiles(req.files);
        console.error(err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};

export const buyerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const buyer = await Buyer.findOne({ email: normalizedEmail }).select('+password');

        if (!buyer) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, buyer.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const token = jwt.sign({ id: buyer._id, role: buyer.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // const buyerObj = buyer.toObject();
        // delete buyerObj.password;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            buyer: {
                id: buyer._id,
                firstName: buyer.firstName,
                lastName: buyer.lastName,
                email: buyer.email,
                role: buyer.role
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

export const buyerForgotPass = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const buyer = await Buyer.findOne({ email });

        if (!buyer) {
            return res.status(400).json({
                success: false,
                message: "Email not found"
            });
        }

        try {
            const secret = process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ id: buyer._id, role: buyer.role }, secret, { expiresIn: '15m' });

            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            const link = `${frontendUrl}/reset-password/${buyer._id}/${token}`;

            await sendEmail(
                email,
                "Reset Your BidDrive Password",
                `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #D97706; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">BidDrive</h1>
    </div>
    
    <div style="padding: 30px; color: #374151;">
      <h2 style="color: #111827;">Reset your password</h2>
      <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
      <p style="font-size: 16px; line-height: 1.5;">We received a request to reset your BidDrive account password. Click the button below to set a new one. This link will expire in <strong>15 minutes</strong>.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #D97706; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
    </div>
    
    <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
      <p>&copy; ${new Date().getFullYear()} BidDrive. All rights reserved.</p>
    </div>
  </div>
  `
            );

            return res.status(200).json({
                success: true,
                message: "Password reset link sent to your email.",
                link
            });
        } catch (mailError) {
            console.error("Error in Token/Email Process:", mailError.message);
            return res.status(500).json({
                success: false,
                message: "Error sending email or generating link"
            });
        }

    } catch (err) {
        console.error("Forgot Pass:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

export const buyerResetpassword = async (req, res) => {
    try {
        const { buyer_id, token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const secret = process.env.JWT_SECRET_KEY;

        try {
            jwt.verify(token, secret);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Link expired or invalid"
            });
        }

        const buyer = await Buyer.findById(buyer_id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        buyer.password = hashedPassword;
        await buyer.save();

        return res.status(200).json({
            success: true,
            message: "Password updated!. You can login now."
        });

    } catch (err) {
        console.error("Reset Pass:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

export const buyerLogout = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        console.log("Logout Error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occur"
        });
    }
};

export const getBuyer = async (req, res) => {
    try {
        const { buyer_id } = req.params;
        const loggedInBuyer = req.buyer;

        if (loggedInBuyer.id !== buyer_id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You can only view your own profile."
            });
        }

        const buyer = await Buyer.findById(buyer_id).select("-password");

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer detail not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Buyer Detail",
            data: buyer
        });

    } catch (err) {
        console.error("Get buyer:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// not done below apis
export const buyerChangePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters"
            });
        }

        const buyer = await Buyer.findById(req.buyer.id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        // verify old password is correct
        const isMatch = await bcrypt.compare(oldPassword, buyer.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // hash and save new password
        const salt = await bcrypt.genSalt(10);
        buyer.password = await bcrypt.hash(newPassword, salt);

        await buyer.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (err) {
        console.log("Error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occur"
        });
    }
};

export const updateBuyerProfile = async (req, res) => {
    try {
        const buyerId = req.buyer.id;
        const allowedFields = [
            'firstName', 'lastName', 'email', 'mobile',
            'dob', 'nationality', 'country', 'city', 'pincode',
            'preferredLanguage', 'timezone'
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) return res.status(404).json({ success: false, message: "Buyer not found" });

        if (updates.email && updates.email !== buyer.email) {
            updates.isEmailVerified = false;
            // trigger OTP send here, reuse existing send-otp function
        }
        if (updates.mobile && updates.mobile !== buyer.mobile) {
            updates.isMobileVerified = false;
        }
        if (updates.username && updates.username !== buyer.username) {
            const exists = await Buyer.findOne({ username: updates.username, _id: { $ne: buyerId } });
            if (exists) {
                return res.status(400).json({ success: false, message: "Username already taken" });
            }
        }

        const updatedBuyer = await Buyer.findByIdAndUpdate(buyerId, updates, {
            new: true,
            runValidators: true
        }).select('-password');

        return res.status(200).json({ success: true, message: "Profile updated", data: updatedBuyer });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Email or mobile already in use" });
        }
        console.error("Update buyer profile:", err);
        return res.status(500).json({ success: false, message: "Server Error Occurred" });
    }
};

