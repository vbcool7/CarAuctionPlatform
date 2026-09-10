
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import Seller from '../models/sellerModelSchema.js';
import OTP from '../models/otpModelSchema.js';

import { deleteCloudinaryFiles, deleteOldFileFromCloudinary } from '../utils/cloudinaryUtils.js';
import { getSellerForStep } from '../utils/sellerRegistrationHelper.js';
import { getNextSellerId } from '../utils/counterHelper.js';

export const registerStep1 = async (req, res) => {
    try {
        const { fullName, email, phone, password, confirmPassword } = req.body;
        const profilePhotoPath = req.file ? req.file.path : "";

        if (!fullName) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Full Name is required"
            });
        }

        if (!email) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        if (!phone) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        if (!password) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        if (!confirmPassword) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Confirm Password is required"
            });
        }

        if (password !== confirmPassword) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            });
        }

        // check if email/phone already reg
        const existingComplete = await Seller.findOne({
            $or: [{ email }, { phone }],
            isComplete: true
        });

        if (existingComplete) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Seller already registered. Please login."
            });
        }

        // if draft exist - then continue from prev steps form
        const existingDraft = await Seller.findOne({
            $or: [{ email }, { phone }],
            isComplete: false
        }).select("+password");

        // Resume path: don't create a duplicate, hand back the existing draft.
        if (existingDraft) {
            if (req.file) await deleteCloudinaryFiles(req.file);

            const passwordMatches = await bcrypt.compare(
                password,
                existingDraft.password
            );

            if (!passwordMatches) {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect password for this registration draft"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Resuming existing registration draft",
                sellerId: existingDraft._id,
                registrationStep: existingDraft.registrationStep,

                // password bilkul return nahi karna
                draft: {
                    fullName: existingDraft.fullName,
                    email: existingDraft.email,
                    phone: existingDraft.phone,
                    profileImage: existingDraft.profileImage,

                    businessName: existingDraft.businessName,
                    businessType: existingDraft.businessType,
                    licenseNumber: existingDraft.licenseNumber,
                    vatNumber: existingDraft.vatNumber,
                    businessYear: existingDraft.businessYear,
                    employees: existingDraft.employees,
                    website: existingDraft.website,
                    businessDescription: existingDraft.businessDescription,

                    country: existingDraft.country,
                    emirate: existingDraft.emirate,
                    city: existingDraft.city,
                    area: existingDraft.area,
                    streetAddress: existingDraft.streetAddress,
                    building: existingDraft.building,
                    poBox: existingDraft.poBox,
                    zipCode: existingDraft.zipCode,

                    accountHolderName: existingDraft.accountHolderName,
                    bankName: existingDraft.bankName,
                    ibanNumber: existingDraft.ibanNumber,
                    accountNumber: existingDraft.accountNumber,
                    swiftCode: existingDraft.swiftCode,
                    currency: existingDraft.currency,

                    documents: {
                        tradeLicense: existingDraft.tradeLicense?.url || "",
                        emiratesId: existingDraft.emiratesId?.url || "",
                        bankStatement: existingDraft.bankStatement?.url || "",
                        vatCertificate: existingDraft.vatCertificate?.url || ""
                    },

                    isEmailVerified: existingDraft.isEmailVerified,
                    isPhoneVerified: existingDraft.isPhoneVerified,
                }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const seller = await Seller.create({
            sellerId: await getNextSellerId(),
            fullName,
            email,
            phone,
            password: hashedPassword,
            profileImage: profilePhotoPath,
            registrationStep: 1
        });

        res.status(201).json({
            success: true,
            message: "Step 1 saved",
            sellerId: seller._id,
            registrationStep: seller.registrationStep
        });

    } catch (err) {
        if (req.file) await deleteCloudinaryFiles(req.file);
        console.error("Seller Step 1 Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to save seller step 1"
        });
    }
}

export const registerStep2 = async (req, res) => {
    try {
        const { id } = req.params;
        const { businessName, businessType, licenseNumber, vatNumber, businessYear, employees, website, businessDescription } = req.body;

        if (!businessName || !businessType || !licenseNumber || !businessYear || !employees) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const { seller, error } = await getSellerForStep(id, 2);

        if (error) {
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        seller.businessName = businessName;
        seller.businessType = businessType;
        seller.licenseNumber = licenseNumber;
        seller.vatNumber = vatNumber; // optional, fine if undefined
        seller.businessYear = businessYear;
        seller.employees = employees;
        seller.website = website;
        seller.businessDescription = businessDescription;
        seller.registrationStep = Math.max(seller.registrationStep, 2);

        await seller.save();

        res.status(200).json({
            success: true,
            message: "Step 2 saved",
            sellerId: seller._id,
            registrationStep: seller.registrationStep
        });

    } catch (err) {
        console.error("Seller Step 2 Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to save seller step 2"
        });
    }
};

export const registerStep3 = async (req, res) => {
    try {
        const { id } = req.params;
        const { country, emirate, city, area, streetAddress, building, poBox, zipCode } = req.body;

        if (!country || !emirate || !city || !area || !streetAddress) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const { seller, error } = await getSellerForStep(id, 3);

        if (error) {
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        seller.country = country;
        seller.emirate = emirate;
        seller.city = city;
        seller.area = area;
        seller.streetAddress = streetAddress;
        seller.building = building;
        seller.poBox = poBox;
        seller.zipCode = zipCode;
        seller.registrationStep = Math.max(seller.registrationStep, 3);

        await seller.save();

        res.status(200).json({
            success: true,
            message: "Step 3 saved",
            sellerId: seller._id,
            registrationStep: seller.registrationStep
        });

    } catch (err) {
        console.error("Seller Step 3 Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to save seller step 3"
        });
    }
};

export const registerStep4 = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountHolderName, bankName, ibanNumber, accountNumber, swiftCode, currency } = req.body;

        if (!accountHolderName || !bankName || !ibanNumber || !accountNumber || !swiftCode || !currency) {
            return res.status(400).json({
                success: false,
                message: "accountHolderName, bankName, ibanNumber, accountNumber, swiftCode and currency are required"
            });
        }

        const { seller, error } = await getSellerForStep(id, 4);

        if (error) {
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        seller.accountHolderName = accountHolderName;
        seller.bankName = bankName;
        seller.ibanNumber = ibanNumber;
        seller.accountNumber = accountNumber;
        seller.swiftCode = swiftCode;
        seller.currency = currency;
        seller.registrationStep = Math.max(seller.registrationStep, 4);

        await seller.save();

        res.status(200).json({
            success: true,
            message: "Step 4 saved",
            sellerId: seller._id,
            registrationStep: seller.registrationStep
        });

    } catch (err) {
        console.error("Seller Step 4 Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to save seller step 4"
        });
    }
};

export const registerStep5 = async (req, res) => {
    try {
        const { id } = req.params;

        const tradeLicense = req.files?.['tradeLicense']?.[0]?.path;
        const emiratesId = req.files?.['emiratesId']?.[0]?.path;
        const bankStatement = req.files?.['bankStatement']?.[0]?.path;
        const vatCertificate = req.files?.['vatCertificate']?.[0]?.path;

        // if (!tradeLicense || !emiratesId || !bankStatement) {
        //     if (req.files) await deleteCloudinaryFiles(req.files);
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please upload all required documents"
        //     });
        // }

        const { seller, error } = await getSellerForStep(id, 5);

        if (error) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        // New file OR already-saved Cloudinary URL — either is valid.
        const hasTradeLicense = tradeLicense || seller.tradeLicense?.url;
        const hasEmiratesId = emiratesId || seller.emiratesId?.url;
        const hasBankStatement = bankStatement || seller.bankStatement?.url;

        if (!hasTradeLicense || !hasEmiratesId || !hasBankStatement) {
            if (req.files) await deleteCloudinaryFiles(req.files);

            return res.status(400).json({
                success: false,
                message: "Please upload all required documents"
            });
        }

        // Replace only those documents for which a new file was selected.
        if (tradeLicense) seller.tradeLicense.url = tradeLicense;
        if (emiratesId) seller.emiratesId.url = emiratesId;
        if (bankStatement) seller.bankStatement.url = bankStatement;
        if (vatCertificate) seller.vatCertificate.url = vatCertificate;

        seller.registrationStep = Math.max(seller.registrationStep, 5);

        await seller.save();

        res.status(200).json({
            success: true,
            message: "Step 5 saved",
            sellerId: seller._id,
            registrationStep: seller.registrationStep,
            documents: {
                tradeLicense: seller.tradeLicense?.url || "",
                emiratesId: seller.emiratesId?.url || "",
                bankStatement: seller.bankStatement?.url || "",
                vatCertificate: seller.vatCertificate?.url || ""
            }
        });

    } catch (err) {
        if (req.files) await deleteCloudinaryFiles(req.files);
        console.error("Seller Step 5 Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to save seller step 5"
        });
    }
};

export const registerStep6 = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            });
        }

        const { seller, error } = await getSellerForStep(id, 6);

        if (error) {
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        const storedOtpDetails = await OTP.findOne({ email: seller.email, role: 'seller' }).sort({ createdAt: -1 });

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

        seller.isEmailVerified = true;
        seller.isPhoneVerified = true;
        seller.registrationStep = Math.max(seller.registrationStep, 6);

        await seller.save();

        res.status(200).json({
            success: true,
            message: "Step 6 saved — email and phone verified",
            sellerId: seller._id,
            registrationStep: seller.registrationStep
        });

    } catch (err) {
        console.error("Seller Step 6 Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to save seller step 6"
        });
    }
};

export const registerStep7 = async (req, res) => {
    try {
        const { id } = req.params;

        const { seller, error } = await getSellerForStep(id, 7);

        if (error) {
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        }

        // Email/phone verification is a hard gate — Step 6 must have run
        // successfully before final submit is allowed.
        if (!seller.isEmailVerified || !seller.isPhoneVerified) {
            return res.status(400).json({
                success: false,
                message: "Email and phone must be verified before submitting"
            });
        }

        seller.isComplete = true;
        seller.status = 'pending';
        seller.submittedAt = new Date();
        seller.registrationStep = 7;

        // No manual field-by-field validation here on purpose — isComplete:true
        // flips every `required: function(){ return this.isComplete }` field to
        // required, so .save() lets Mongoose's own validation catch anything
        // missing and return a proper ValidationError below.
        await seller.save();

        res.status(200).json({
            success: true,
            message: "Registration submitted successfully. Awaiting admin approval.",
            sellerId: seller._id,
            status: seller.status
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const missingFields = Object.keys(err.errors);
            return res.status(400).json({
                success: false,
                message: "Some required fields are missing",
                fields: missingFields
            });
        }

        console.error("Seller Step 7 Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to submit registration"
        });
    }
};

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const seller = await Seller.findOne({ email: normalizedEmail }).select('+password');

        if (!seller) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, seller.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        if (!seller.isComplete) {
            return res.status(403).json({
                success: false,
                message: "Please complete your seller registration first"
            });
        }

        if (!seller.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Your email address is not verified"
            });
        }

        if (seller.accountStatus === 'suspended') {
            return res.status(403).json({
                success: false,
                message: "Your account has been suspended. Please contact support.",
            });
        }

        if (seller.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: "Your registration is awaiting admin approval"
            });
        }

        if (seller.status === "rejected") {
            return res.status(403).json({
                success: false,
                message: "Your registration has been rejected. Please contact support."
            });
        }

        seller.lastLoginAt = new Date();

        const token = jwt.sign({ id: seller._id, role: seller.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            seller: {
                id: seller._id,
                fullName: seller.fullName,
                email: seller.email,
                role: seller.role
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

export const sellerForgotPass = async (req, res) => {
    try {
        const { email } = req.body;

        console.log("SELLER FORGOT EMAIL:", email);

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const seller = await Seller.findOne({ email });

        console.log("SELLER FOUND:", seller ? seller._id : "NOT FOUND");

        if (!seller) {
            return res.status(400).json({
                success: false,
                message: "Email not found"
            });
        }

        try {
            const secret = process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ id: seller._id, role: seller.role }, secret, { expiresIn: '15m' });

            const frontendUrl = process.env.FORGOTPASSWORD_URL || "http://localhost:5173";
            const link = `${frontendUrl}/reset-password/${seller._id}/${token}?role=seller`;

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

export const sellerResetpassword = async (req, res) => {
    try {
        const { seller_id, token } = req.params;
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

        const seller = await Seller.findById(seller_id);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        seller.password = hashedPassword;
        await seller.save();

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

export const sellerLogout = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Seller Logout Successfully!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

export const sellerGet = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const seller = await Seller.findById(sellerId).select("-password");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        res.status(200).json({
            success: true,
            data: seller
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// reupload seller doc
export const reuploadSellerDocs = async (req, res) => {
    try {
        const { seller_id, document, token } = req.params;

        const allowedDocuments = ['tradeLicense', 'emiratesId', 'bankStatement', 'vatCertificate'];

        if (!allowedDocuments.includes(document)) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Invalid verification document"
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

        if (decoded.purpose !== 'kyc_reupload' || decoded.id !== seller_id || decoded.document !== document) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Reupload link is invalid"
            });
        }

        const seller = await Seller.findById(seller_id);

        if (!seller) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (seller[document].status !== 'rejected') {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "This document is not pending reupload, or the link has already been used"
            });
        }

        // ASSUMPTION: multer field-name === document key itself (e.g. 'tradeLicense')
        // confirm this matches the actual sellerUploads multer config before testing
        if (!req.files?.[document]?.[0]) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Document file is required"
            });
        }

        const oldUrl = seller[document].url;

        seller[document].url = req.files[document][0].path;
        seller[document].status = 'pending';
        seller[document].rejectionReason = undefined;
        // reviewedAt intentionally left untouched — same convention as buyer flow

        // recompute overall seller.status (reuse same aggregation rule)
        const mandatoryDocs = ['tradeLicense', 'emiratesId', 'bankStatement'];
        const allDocs = [...mandatoryDocs, 'vatCertificate'];

        const hasRejected = allDocs.some(d => seller[d]?.url && seller[d].status === 'rejected');
        const mandatoryApproved = mandatoryDocs.every(d => seller[d]?.status === 'approved');
        const vatOk = !seller.vatCertificate?.url || seller.vatCertificate.status === 'approved';

        seller.status = hasRejected ? 'pending' : (mandatoryApproved && vatOk ? 'approved' : 'pending');

        await seller.save();

        // delete old file only AFTER successful save
        if (oldUrl) {
            await deleteOldFileFromCloudinary(oldUrl);
        }

        const sellerToReturn = seller.toObject();
        delete sellerToReturn.password;

        return res.status(200).json({
            success: true,
            message: `${document} document re-submitted for review`,
            data: sellerToReturn
        });

    } catch (err) {
        if (req.files) await deleteCloudinaryFiles(req.files);
        console.error("Reupload Seller Docs Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};