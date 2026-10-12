
import bcrypt from 'bcrypt';
import jwt, { decode } from 'jsonwebtoken';
import Buyer from '../models/buyerModelSchema.js';
import Bid from '../models/bidModelSchema.js';
import Watchlist from '../models/watchlistModelSchema.js';
import OTP from '../models/otpModelSchema.js';
import sendEmail from '../utils/sendEmail.js';

import { deleteCloudinaryFiles, deleteOldFileFromCloudinary } from '../utils/cloudinaryUtils.js';
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
            !dob || !country || !emirate || !city || !address || !buyerType ||
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

        // ---- SUSPEND CHECK ----
        if (buyer.accountStatus === 'suspended') {
            return res.status(403).json({
                success: false,
                message: "Your account has been suspended. Please contact support.",
            });
        }

        if (buyer.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: "Your account is awaiting admin approval. Please check back later.",
                status: 'pending'
            });
        }

        if (buyer.status === 'rejected') {
            return res.status(403).json({
                success: false,
                message: "Your KYC verification was rejected. Please re-upload your documents to continue.",
                status: 'rejected'
            });
        }

        const token = jwt.sign({ id: buyer._id, role: buyer.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

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

            const frontendUrl = process.env.FORGOTPASSWORD_URL || "http://localhost:5173";
            const link = `${frontendUrl}/reset-password/${buyer._id}/${token}?role=buyer`;

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
        const { id } = req.params;
        const loggedInBuyer = req.user;

        if (loggedInBuyer.id !== id) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You can only view your own profile."
            });
        }

        const buyer = await Buyer.findById(id).select("-password");

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

// re-upload docs
export const reuploadBuyerDocs = async (req, res) => {
    try {
        const { buyer_id, group, token } = req.params;

        if (!['identity', 'address'].includes(group)) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Invalid verification group"
            });
        }

        let decoded;
        try {
            const secret = process.env.JWT_SECRET_KEY;
            decoded = jwt.verify(token, secret);
        } catch (jwtErr) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Reupload link is invalid or has expired"
            });
        }

        if (decoded.purpose !== 'kyc_reupload' || decoded.id !== buyer_id || decoded.group !== group) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Reupload link is invalid"
            });
        }

        const buyer = await Buyer.findById(buyer_id);

        if (!buyer) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        const fieldKey = group === 'identity' ? 'identityVerification' : 'addressVerification';

        if (buyer[fieldKey].status !== 'rejected') {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "This document is not pending reupload, or the link has already been used"
            });
        }

        // capture old URLs BEFORE overwriting, so we can delete them after a successful save
        const oldUrls = [];

        if (group === 'identity') {
            if (!req.files?.frontImageUrl?.[0] || !req.files?.selfieImageUrl?.[0]) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: "Front image and selfie are required"
                });
            }

            if (['passport', 'national_id'].includes(buyer.identityVerification.documentType) && !req.files?.backImageUrl?.[0]) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: "Back image required for passport/national ID"
                });
            }

            if (buyer.identityVerification.frontImageUrl) oldUrls.push(buyer.identityVerification.frontImageUrl);
            if (buyer.identityVerification.selfieImageUrl) oldUrls.push(buyer.identityVerification.selfieImageUrl);
            if (buyer.identityVerification.backImageUrl) oldUrls.push(buyer.identityVerification.backImageUrl);

            buyer.identityVerification.frontImageUrl = req.files.frontImageUrl[0].path;
            buyer.identityVerification.selfieImageUrl = req.files.selfieImageUrl[0].path;

            if (req.files.backImageUrl?.[0]) {
                buyer.identityVerification.backImageUrl = req.files.backImageUrl[0].path;
            }
        } else {
            if (!req.files?.documentUrl?.[0]) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: "Document is required"
                });
            }

            if (buyer.addressVerification.documentType === 'rental_agreement' && !req.files?.landlordIdUrl?.[0]) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: "Landlord ID required for rental agreement"
                });
            }

            if (buyer.addressVerification.documentUrl) oldUrls.push(buyer.addressVerification.documentUrl);
            if (buyer.addressVerification.landlordIdUrl) oldUrls.push(buyer.addressVerification.landlordIdUrl);

            buyer.addressVerification.documentUrl = req.files.documentUrl[0].path;

            if (req.files.landlordIdUrl?.[0]) {
                buyer.addressVerification.landlordIdUrl = req.files.landlordIdUrl[0].path;
            }
        }

        buyer[fieldKey].status = 'pending';
        buyer[fieldKey].rejectionReason = undefined;
        // reviewedAt intentionally left untouched — confirmed earlier

        await buyer.save();

        // delete old files only AFTER successful save, so a failed save never loses the old doc
        for (const url of oldUrls) {
            await deleteOldFileFromCloudinary(url);
        }

        const buyerToReturn = buyer.toObject();
        delete buyerToReturn.password;

        return res.status(200).json({
            success: true,
            message: `${group} document re-submitted for review`,
            data: buyerToReturn
        });

    } catch (err) {
        console.log("Reupload Buyer Docs Error: ", err);
        if (req.files) await deleteCloudinaryFiles(req.files);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// change password (buyer)
export const buyerChangePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
 
        const allStrings = [currentPassword, newPassword, confirmPassword]
            .every((v) => typeof v === 'string' && v.length > 0);
 
        if (!allStrings) {
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
 
        if (newPassword === currentPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password"
            });
        }
 
        const buyer = await Buyer.findById(req.user.id).select('+password');
 
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }
 
        const isMatch = await bcrypt.compare(currentPassword, buyer.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
 
        await Buyer.updateOne({ _id: buyer._id }, { $set: { password: hashedPassword } });
 
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
 
    } catch (err) {
        console.error("Buyer change password error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};
 
// update profile (buyer) - sirf phone + profile photo
export const updateBuyerProfile = async (req, res) => {

    const hasUpload = !!req.files?.['profileImage']?.length;
 
    const discardUpload = async () => {
        if (!hasUpload) return;
        try {
            await deleteCloudinaryFiles(req.files);
        } catch (cleanupErr) {
            console.error("Profile upload cleanup failed:", cleanupErr);
        }
    };
 
    try {
        const newImageUrl = req.files?.['profileImage']?.[0]?.path;
 
        const buyer = await Buyer.findById(req.user.id).select('mobile profileImageUrl');
 
        if (!buyer) {
            await discardUpload();
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }
 
        const updates = {};
 
        if (req.body.mobile !== undefined) {
            const mobile = String(req.body.mobile).trim();
 
            if (mobile !== buyer.mobile) {
                if (!/^\d{10}$/.test(mobile)) {
                    await discardUpload();
                    return res.status(400).json({
                        success: false,
                        message: "Mobile number must be 10 digits"
                    });
                }
 
                const taken = await Buyer.exists({ mobile, _id: { $ne: buyer._id } });
                if (taken) {
                    await discardUpload();
                    return res.status(409).json({
                        success: false,
                        message: "This mobile number is already registered"
                    });
                }
 
                updates.mobile = mobile;
                updates.isMobileVerified = false;  
            }
        }
 
        if (newImageUrl) {
            updates.profileImageUrl = newImageUrl;
        }
 
        if (Object.keys(updates).length === 0) {
            await discardUpload();
            return res.status(400).json({
                success: false,
                message: "No changes to save"
            });
        }
 
        const updated = await Buyer.findByIdAndUpdate(
            buyer._id,
            { $set: updates },
            { new: true }
        ).select('-password');
 
        if (newImageUrl && buyer.profileImageUrl) {
            try {
                await deleteOldFileFromCloudinary(buyer.profileImageUrl);
            } catch (delErr) {
                console.error("Old profile photo delete failed (non-fatal):", delErr);
            }
        }
 
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updated
        });
 
    } catch (err) {
        await discardUpload();
 
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This mobile number is already registered"
            });
        }
 
        console.error("Update buyer profile error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// Get buyer dashboard stats - NOT WORKED
export const getBuyerDashboardStats = async (req, res) => {
    try {
        const buyerId = req.user.id;

        const [totalBids, watchlist] = await Promise.all([
            Bid.countDocuments({
                bidderId: buyerId,
                bidderType: 'Buyer',
                status: { $in: ['active', 'outbid', 'won'] },
            }),

            Watchlist.findOne({
                userId: buyerId,
                userType: 'Buyer',
            }).select('items'),
        ]);

        const totalWatchlisted = watchlist?.items?.length || 0;

        return res.status(200).json({
            success: true,
            message: 'Buyer dashboard stats fetched successfully',
            data: {
                totalBids,
                totalWatchlisted,
            },
        });
    } catch (error) {
        console.error('getBuyerDashboardStats error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server Error Occurred',
        });
    }
};