
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import { buildWelcomeEmail, buildPendingActivationEmail, buildBuyerWelcomeEmail, buildPendingBuyerActivationEmail, reUploadDocumentEmail, reUploadSellerDocumentEmail } from '../utils/emailTemplates.js';
import { deleteCloudinaryFiles } from '../utils/cloudinaryUtils.js';
import { getNextBuyerId, getNextSellerId } from '../utils/counterHelper.js';

import Admin from '../models/adminModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';

export const adminSignup = async (req, res) => {
    try {
        const { name, email, password, adminSecret } = req.body;
        const profilePhotoPath = req.file ? req.file.path : "";

        if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(403).json({
                success: false,
                message: "Unauthorized! Invalid Secret Key"
            });
        }

        if (!name || !email || !password) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Admin email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin({
            name,
            email,
            password: hashedPassword,
            profilePhoto: profilePhotoPath
        });

        await newAdmin.save();
        res.status(201).json({
            success: true,
            message: "Admin account created!",
            data: { name, email }
        });

    } catch (err) {
        if (req.file) await deleteCloudinaryFiles(req.file);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required fields"
            });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not registsred"
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Admin login success",
            token,
            admin: {
                name: admin.name,
                email: admin.email
            }
        });
    } catch (err) {
        console.log("Err:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

export const adminLogout = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Admin Logout Successfully!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

export const adminGet = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await Admin.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// add new buyer
export const addNewBuyer = async (req, res) => {
    try {
        const {
            firstName, lastName, email, mobile, gender,
            dob, nationality, country, emirate, city, address, pincode, buyerType, companyName, registrationNumber, vatNumber,
            paymentMethod, isEmailVerified, isMobileVerified, identityDocType, addressDocType,
            sendWelcomeEmail: shouldSendWelcomeEmail
        } = req.body;

        const profileImageUrl = req.files?.['profileImageUrl']?.[0]?.path || "";
        const frontImageUrl = req.files?.['frontImageUrl']?.[0]?.path;
        const backImageUrl = req.files?.['backImageUrl']?.[0]?.path;
        const selfieImageUrl = req.files?.['selfieImageUrl']?.[0]?.path;
        const documentUrl = req.files?.['documentUrl']?.[0]?.path;
        const landlordIdUrl = req.files?.['landlordIdUrl']?.[0]?.path;

        const requiredFields = [
            { value: firstName, label: "First Name" },
            { value: lastName, label: "Last Name" },
            { value: email, label: "Email" },
            { value: mobile, label: "Mobile Number" },
            { value: dob, label: "Date Of Birth" },
            { value: country, label: "Country" },
            { value: emirate, label: "Emirate" },
            { value: city, label: "City" },
            { value: address, label: "Address" },
            { value: buyerType, label: "Buyer Type" },
            { value: paymentMethod, label: "Payment Method" },
            { value: frontImageUrl, label: "Identity Front Image" },
            { value: selfieImageUrl, label: "Selfie Image" },
            { value: documentUrl, label: "Address Document" },
        ];

        for (const field of requiredFields) {
            if (!field.value) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: `${field.label} is required`,
                });
            }
        }

        if (!buyerType) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Buyer Type is required"
            });
        }

        if (['dealer', 'business'].includes(buyerType)) {
            if (!companyName || !registrationNumber) {
                if (req.files) await deleteCloudinaryFiles(req.files);
                return res.status(400).json({
                    success: false,
                    message: "Company Name and Registration Number are required for dealer/business buyerType"
                });
            }
        }

        if (!paymentMethod) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Payment Method is required"
            });
        }

        const existingBuyer = await Buyer.findOne({ $or: [{ email }, { mobile }] });
        if (existingBuyer) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(409).json({
                success: false,
                message: "A buyer with this email or mobile already exists"
            });
        }

        const rawPassword = crypto.randomBytes(6).toString('base64').slice(0, 10);
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const buyerId = await getNextBuyerId();

        const newBuyer = new Buyer({
            buyerId,
            firstName, lastName, email, mobile, password: hashedPassword, gender, profileImageUrl,

            identityVerification: { documentType: identityDocType, frontImageUrl, backImageUrl, selfieImageUrl },
            addressVerification: { documentType: addressDocType, documentUrl, landlordIdUrl, },

            dob, nationality, country, emirate, city, address, pincode, buyerType, companyName, registrationNumber, vatNumber,

            isEmailVerified: isEmailVerified === 'true' || isEmailVerified === true,
            isMobileVerified: isMobileVerified === 'true' || isMobileVerified === true,

            payment: { method: paymentMethod },

            status: 'approved',
            createdBy: 'admin',
            addedByAdminId: req.user.id
        });

        await newBuyer.save();

        const isVerified = newBuyer.isEmailVerified;

        const { subject, html } = isVerified
            ? buildBuyerWelcomeEmail(email, rawPassword)
            : buildPendingBuyerActivationEmail(email);

        const buyerToReturn = newBuyer.toObject();
        delete buyerToReturn.password;

        res.status(201).json({
            success: true,
            message: isVerified
                ? "Buyer created. Login credentials sent to their email."
                : "Buyer created. Pending verification email sent.",
            data: buyerToReturn
        });

        if (shouldSendWelcomeEmail !== 'false') {
            try {
                await sendEmail(newBuyer.email, subject, html);
            } catch (emailErr) {
                console.error("Welcome email failed to send:", emailErr);
            }
        }

    } catch (err) {
        if (req.files) {
            try {
                await deleteCloudinaryFiles(req.files);
            } catch (cleanupErr) {
                console.error('Cloudinary cleanup failed:', cleanupErr);
            }
        }

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get all buyers
export const getAllBuyers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [buyers, totalCount] = await Promise.all([
            Buyer.find()
                .select('buyerId firstName lastName profileImageUrl email mobile buyerType status lastLoginAt createdAt createdBy isEmailVerified identityVerification.status identityVerification.documentType addressVerification.status addressVerification.documentType')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Buyer.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            buyers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        });

    } catch (err) {
        console.error("All Buyers Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// toggle - buyer email/phone verification
export const toggleBuyerVerification = async (req, res) => {
    try {
        const { buyerId } = req.params;
        const { isVerified } = req.body;

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        const wasUnverified = !buyer.isEmailVerified;
        const nowVerified = isVerified === true || isVerified === 'true';

        buyer.isEmailVerified = nowVerified;
        buyer.isPhoneVerified = nowVerified;

        if (wasUnverified && nowVerified) {
            const rawPassword = crypto.randomBytes(6).toString('base64').slice(0, 10); // ← new password generate
            buyer.password = await bcrypt.hash(rawPassword, 10);

            await buyer.save();

            const { subject, html } = buildBuyerWelcomeEmail(buyer.email, rawPassword);
            try {
                await sendEmail(buyer.email, subject, html);
            } catch (emailErr) {
                console.error("Verification welcome email failed:", emailErr);
                // response abhi bhi success jayega — email fail hone se verification revert nahi honi chahiye
            }
        } else {
            await buyer.save();
        }

        return res.status(200).json({
            success: true,
            message: nowVerified ? "Buyer verified and activated" : "Buyer marked unverified"
        });

    } catch (err) {
        console.error("Toggle Verification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get buyer by id
export const getBuyerById = async (req, res) => {
    try {
        const { id } = req.params;
        const buyer = await Buyer.findById(id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Here is buyer detail",
            data: buyer
        });
    } catch (err) {
        console.error("Get buyer By ID Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    };
};

// buyer doc verification
export const buyerDocVerification = async (req, res) => {
    try {
        const { id, group } = req.params;
        const { action, rejectionReason } = req.body;

        if (!['identity', 'address'].includes(group)) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification group"
            });
        }

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be 'approve' or 'reject'"
            });
        }

        if (action === 'reject' && !rejectionReason?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const buyer = await Buyer.findById(id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        const fieldKey = group === 'identity' ? 'identityVerification' : 'addressVerification';

        buyer[fieldKey].status = action === 'approve' ? 'approved' : 'rejected';
        buyer[fieldKey].reviewedAt = new Date();
        buyer[fieldKey].rejectionReason = action === 'reject' ? rejectionReason.trim() : undefined;

        if (action === 'reject') {
            buyer.status = 'pending';
        } else {
            const bothApproved =
                buyer.identityVerification.status === 'approved' &&
                buyer.addressVerification.status === 'approved';

            if (bothApproved) {
                buyer.status = 'approved';
            }
        }

        await buyer.save();

        const buyerToReturn = buyer.toObject();
        delete buyerToReturn.password;

        res.status(200).json({
            success: true,
            message: `${group} verification ${action}d successfully`,
            data: buyerToReturn
        });

        if (action === 'reject') {
            try {
                const secret = process.env.JWT_SECRET_KEY;
                const token = jwt.sign({ id: buyer._id, group, purpose: 'kyc_reupload' }, secret, { expiresIn: '7d' });

                const frontendUrl = process.env.REUPLOAD_DOC_URL || "http://localhost:5173/reupload-buyer-docs";
                const link = `${frontendUrl}/${buyer._id}/${token}/${group}`;

                const { subject, html } = reUploadDocumentEmail(
                    buyer.email,
                    group,
                    rejectionReason.trim(),
                    link
                );
                await sendEmail(buyer.email, subject, html);
            } catch (emailErr) {
                console.error("Rejection email failed to send:", emailErr);
            }
        }

    } catch (err) {
        console.log("Buyer document verification error : ", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// add new seller
export const addNewSeller = async (req, res) => {
    try {
        const {
            fullName, email, phone,
            businessName, businessType, licenseNumber, vatNumber, businessYear, employees, website, businessDescription,
            country, emirate, city, area, streetAddress, building, poBox, zipCode,
            accountHolderName, bankName, ibanNumber, accountNumber, swiftCode, currency,
            status,
            isEmailVerified, isPhoneVerified,
            sendWelcomeEmail: shouldSendWelcomeEmail
        } = req.body;

        const profileImage = req.files?.['profileImage']?.[0]?.path || "";
        const tradeLicense = req.files?.['tradeLicense']?.[0]?.path;
        const emiratesId = req.files?.['emiratesId']?.[0]?.path;
        const bankStatement = req.files?.['bankStatement']?.[0]?.path;
        const vatCertificate = req.files?.['vatCertificate']?.[0]?.path;

        const required = {
            fullName, email, phone, businessName, businessType, licenseNumber,
            businessYear, employees, country, emirate, city, area, streetAddress,
            accountHolderName, bankName, ibanNumber, accountNumber, swiftCode, currency
        };
        const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
        if (missing.length) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                fields: missing
            });
        }

        const existing = await Seller.findOne({ $or: [{ email }, { phone }], isComplete: true });
        if (existing) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Seller already exists with this email or phone"
            });
        }

        if (!tradeLicense || !emiratesId || !bankStatement) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Please upload all required documents"
            });
        }

        if (status && !['approved', 'pending'].includes(status)) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const rawPassword = crypto.randomBytes(6).toString('base64').slice(0, 10);
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const seller = await Seller.create({
            sellerId: await getNextSellerId(),
            fullName, email, phone,
            password: hashedPassword,
            businessName, businessType, licenseNumber, vatNumber, businessYear, employees, website, businessDescription,
            country, emirate, city, area, streetAddress, building, poBox, zipCode,
            accountHolderName, bankName, ibanNumber, accountNumber, swiftCode, currency,
            profileImage: profileImage || "",
            tradeLicense: { url: tradeLicense },
            emiratesId: { url: emiratesId },
            bankStatement: { url: bankStatement },
            vatCertificate: vatCertificate ? { url: vatCertificate } : undefined,

            isComplete: true,
            status: status || 'approved',               // admin-created = active immediately, per earlier decision
            createdBy: 'admin',
            isEmailVerified: isEmailVerified === 'true' || isEmailVerified === true,
            isPhoneVerified: isPhoneVerified === 'true' || isPhoneVerified === true,
            registrationStep: 7,           // treat as fully complete; wizard doesn't apply here
            addedByAdminId: req.admin?.id,
        });

        const isVerified = seller.isEmailVerified;

        const { subject, html } = isVerified
            ? buildWelcomeEmail(email, rawPassword)
            : buildPendingActivationEmail(email);

        res.status(201).json({
            success: true,
            message: isVerified
                ? "Seller created. Login credentials sent to their email."
                : "Seller created. Pending verification email sent.",
            sellerId: seller._id
        });

        if (shouldSendWelcomeEmail !== 'false') {
            try {
                await sendEmail(seller.email, subject, html);
            } catch (emailErr) {
                console.error("Welcome email failed to send:", emailErr);
            }
        }

    } catch (err) {
        if (req.files) await deleteCloudinaryFiles(req.files);
        console.error("Add Seller Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get all sellers
export const getAllSellers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isComplete: true };

        const [sellers, totalCount] = await Promise.all([
            Seller.find(filter)
                .select('fullName profileImage email phone businessName businessType licenseNumber status lastLoginAt createdAt createdBy isEmailVerified tradeLicense emiratesId bankStatement vatCertificate submittedAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Seller.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            sellers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        });

    } catch (err) {
        console.error("Fetching All Sellers Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
}

// toggle - seller email/phone verification
export const toggleSellerVerification = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { isVerified } = req.body;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const wasUnverified = !seller.isEmailVerified;
        const nowVerified = isVerified === true || isVerified === 'true';

        seller.isEmailVerified = nowVerified;
        seller.isPhoneVerified = nowVerified;

        if (wasUnverified && nowVerified) {
            const rawPassword = crypto.randomBytes(6).toString('base64').slice(0, 10); // ← new password generate
            seller.password = await bcrypt.hash(rawPassword, 10);
            await seller.save();

            const { subject, html } = buildWelcomeEmail(seller.email, rawPassword);
            try {
                await sendEmail(seller.email, subject, html);
            } catch (emailErr) {
                console.error("Verification welcome email failed:", emailErr);
                // response abhi bhi success jayega — email fail hone se verification revert nahi honi chahiye
            }
        } else {
            await seller.save();
        }

        return res.status(200).json({
            success: true,
            message: nowVerified ? "Seller verified and activated" : "Seller marked unverified"
        });

    } catch (err) {
        console.error("Toggle Verification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get seller by id
export const getSellerById = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Here is seller detail",
            data: seller
        });
    } catch (err) {
        console.error("Get Seller By ID Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    };
};

// seller doc verification
export const sellerDocVerification = async (req, res) => {
    try {
        const { id, document } = req.params;
        const { action, rejectionReason } = req.body;

        const allowedDocuments = ['tradeLicense', 'emiratesId', 'bankStatement', 'vatCertificate'];

        if (!allowedDocuments.includes(document)) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification document"
            });
        }

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be 'approve' or 'reject'"
            });
        }

        if (action === 'reject' && !rejectionReason?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const seller = await Seller.findById(id);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        // add here doc
        seller[document].status = action === 'approve' ? 'approved' : 'rejected';
        seller[document].reviewedAt = new Date();
        seller[document].rejectionReason = action === 'reject' ? rejectionReason.trim() : '';

        // --- NEW: recompute overall seller.status ---
        const mandatoryDocs = ['tradeLicense', 'emiratesId', 'bankStatement'];
        const allDocs = [...mandatoryDocs, 'vatCertificate'];

        const hasRejected = allDocs.some(d => seller[d]?.url && seller[d].status === 'rejected');
        const mandatoryApproved = mandatoryDocs.every(d => seller[d]?.status === 'approved');
        const vatOk = !seller.vatCertificate?.url || seller.vatCertificate.status === 'approved';

        seller.status = hasRejected ? 'pending' : (mandatoryApproved && vatOk ? 'approved' : 'pending');

        await seller.save();

        const sellerToReturn = seller.toObject();
        delete sellerToReturn.password;

        res.status(200).json({
            success: true,
            message: `${document} verification ${action}d successfully`,
            data: sellerToReturn
        });

        if (action === 'reject') {
            try {
                const secret = process.env.JWT_SECRET_KEY;
                const token = jwt.sign(
                    { id: seller._id, document, purpose: 'kyc_reupload' },
                    secret,
                    { expiresIn: '7d' }
                );

                const frontendUrl = process.env.SELLER_REUPLOAD_DOC_URL || "http://localhost:5173/reupload-seller-docs";
                const link = `${frontendUrl}/${seller._id}/${token}/${document}`;

                const { subject, html } = reUploadSellerDocumentEmail(
                    seller.email,
                    document,
                    rejectionReason.trim(),
                    link
                );
                await sendEmail(seller.email, subject, html);
            } catch (emailErr) {
                console.error("Rejection email failed to send:", emailErr);
            }
        }
    } catch (err) {
        console.error("Seller document verification error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to update document verification",
            error: err.message
        });
    }
};

// =========================================================

// get all vehicles
export const getAllVehicles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status } = req.query;

        const filter = status && status !== 'all-requests' ? { adminStatus: status } : {};

        const [vehicles, totalCount] = await Promise.all([
            Vehicle.find(filter)
                .select('listingId sellerId images year make model vin bodyType exteriorColor transmission adminStatus rejectionReason reviewedAt reviewedBy createdAt')
                .populate({
                    path: 'sellerId',
                    select: 'fullName sellerId email phone profileImage'
                })
                .populate({
                    path: 'reviewedBy',
                    select: 'name profilePhoto'
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Vehicle.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            vehicles,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        });

    } catch (err) {
        console.error("All Vehicles Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// review vehicle
export const reviewVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, rejectionReason } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be 'approve' or 'reject'"
            });
        }

        if (action === 'reject' && !rejectionReason?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required"
            });
        }

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        if (vehicle.adminStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `This vehicle has already been ${vehicle.adminStatus}`
            });
        }

        if (action === 'approve') {
            vehicle.adminStatus = 'approved';
            vehicle.reviewedAt = Date.now();
            vehicle.rejectionReason = undefined;
            vehicle.reviewedBy = req.user.id;
            vehicle.auctionStatus = 'upcoming';
        } else {
            vehicle.adminStatus = 'rejected';
            vehicle.rejectionReason = rejectionReason.trim();
            vehicle.reviewedAt = Date.now();
            vehicle.reviewedBy = req.user.id;
        }

        await vehicle.save();

        return res.status(200).json({
            success: true,
            message: `Vehicle ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
            data: vehicle
        });

    } catch (err) {
        console.log("Review Vehicle Error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get vehicles by seller
export const getVehiclesBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const [vehicles, total] = await Promise.all([
            Vehicle.find({ sellerId })
                .select('listingId make model year vin bodyType priceType startingBidPrice buyNowPrice reservePrice adminStatus auctionStatus images createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Vehicle.countDocuments({ sellerId }),
        ]);

        res.status(200).json({
            success: true,
            message: "Vehicles fetched",
            data: vehicles,
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: Number(page)
            },
        });

    } catch (err) {
        console.error("Get Vehicles By Seller Error:", err);
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
        const vehicle = await Vehicle.findById(id)
            .populate("sellerId", "fullName email phone profileImage status");

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
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

// get vehicle approval summary - donut
export const getVehicleApprovalSummary = async (req, res) => {
    try {
        const [approved, pending, rejected] = await Promise.all([
            Vehicle.countDocuments({ adminStatus: "approved" }),
            Vehicle.countDocuments({ adminStatus: "pending" }),
            Vehicle.countDocuments({ adminStatus: "rejected" }),
        ]);

        const total = approved + pending + rejected;

        return res.status(200).json({
            success: true,
            data: {
                total,
                approved,
                pending,
                rejected,
            },
        });

    } catch (err) {
        console.error("Get Vehicle Approval Summary Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error Occurred",
        });
    }
};