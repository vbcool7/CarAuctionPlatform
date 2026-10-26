
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import sendEmail from '../utils/sendEmail.js';
import {
    buildWelcomeEmail, buildPendingActivationEmail, buildBuyerWelcomeEmail, buildPendingBuyerActivationEmail, reUploadDocumentEmail, reUploadSellerDocumentEmail,
    buildBuyerSuspendedEmail, buildBuyerReactivatedEmail, buildSellerSuspendedEmail, buildSellerReactivatedEmail,
    buildManagerWelcomeEmail
} from '../utils/emailTemplates.js';

import { deleteCloudinaryFiles, deleteOldFileFromCloudinary, deleteStoredFile } from '../utils/cloudinaryUtils.js';
import { getNextBuyerId, getNextSellerId } from '../utils/counterHelper.js';
import { UAE_UTC_OFFSET_HOURS, DURATION_MS, parseTime12h } from '../models/vehicleModelSchema.js';

import Admin from '../models/adminModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Bid from '../models/bidModelSchema.js';
import Payout from '../models/payoutModelSchema.js';
import Order from '../models/orderModelSchema.js';
import PaymentEvent from '../models/paymentEventModelSchema.js';
import Notification from '../models/notificationModelSchema.js';

import { getStripe } from "../config/stripe.js";
import { createPayoutForOrder } from "../utils/payoutHelper.js";
import { createNotification } from '../services/notificationService.js';

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message });
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

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

// admin + manager
export const login = async (req, res) => {
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
                message: "Account not found"
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // if manager inactive
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact the administrator."
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role, permissions: admin.permissions },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login success",
            token,
            admin: {
                name: admin.name,
                email: admin.email,
                profilePhoto: admin.profilePhoto,
                role: admin.role,
                permissions: admin.permissions
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

// ============================================ MANAGER

// add manager
export const addManager = async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;
        const profilePhotoPath = req.file ? req.file.path : "";

        if (!name || !email || !password || !permissions) {
            if (req.file) {
                await deleteCloudinaryFiles(req.file);
            }

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if email already exists
        const existingAdmin = await Admin.findOne({
            email: normalizedEmail
        });

        if (existingAdmin) {
            if (req.file) {
                await deleteCloudinaryFiles(req.file);
            }

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        let parsedPermissions;
        try {
            parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;
        } catch (e) {
            parsedPermissions = {};
        }

        // All 7 permission keys (manageSettings intentionally excluded)
        const permissionKeys = [
            'manageAuctions',
            'manageBids',
            'manageVehicles',
            'manageUsers',
            'managePayments',
            'managePayouts',
            'manageReports'
        ];

        // Build normalized permissions object (booleans only, unknown keys ignored)
        const newPermissions = {};
        permissionKeys.forEach((key) => {
            newPermissions[key] = !!parsedPermissions?.[key];
        });

        // Which permissions is this request actually trying to turn ON
        const requestedTrueKeys = permissionKeys.filter((key) => newPermissions[key] === true);

        // Exclusivity check — a permission can be true for only ONE active manager at a time
        if (requestedTrueKeys.length > 0) {
            const activeManagers = await Admin.find({
                role: "auctionManager",
                isActive: true
            });

            const conflicts = [];

            requestedTrueKeys.forEach((key) => {
                const holder = activeManagers.find((mgr) => mgr.permissions?.[key] === true);
                if (holder) {
                    conflicts.push({ permission: key, heldBy: holder.name, managerId: holder._id });
                }
            });

            if (conflicts.length > 0) {
                if (req.file) {
                    await deleteCloudinaryFiles(req.file);
                }

                return res.status(409).json({
                    success: false,
                    message: "One or more requested permissions are already assigned to another active manager",
                    conflicts
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create manager account
        const newManager = new Admin({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            profilePhoto: profilePhotoPath,
            role: "auctionManager",
            permissions: newPermissions
        });

        try {
            await newManager.save();
        } catch (saveErr) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            console.error("Error to save new manager:", saveErr);
            return res.status(500).json({
                success: false,
                message: "Error to save new manager"
            });
        }

        // Build manager invitation email
        const { subject, html } = buildManagerWelcomeEmail(
            normalizedEmail,
            password
        );

        // Send invitation email
        try {
            await sendEmail(normalizedEmail, subject, html);
        } catch (mailErr) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            await Admin.findByIdAndDelete(newManager._id);
            console.error("Manager created but email failed, rolled back:", mailErr);
            return res.status(500).json({
                success: false,
                message: "Failed to send invitation email. Manager account was not created — please try again."
            });
        }

        return res.status(201).json({
            success: true,
            message: "Auction Manager account created and invitation email sent successfully",
            data: {
                name: newManager.name,
                email: newManager.email
            }
        });

    } catch (err) {
        if (req.file) {
            await deleteCloudinaryFiles(req.file);
        }

        console.error("Add Manager Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get all managers
export const getAllManagers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // filters
        const filter = { role: "auctionManager" };

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // search by name or email
        if (req.query.search) {
            const searchRegex = new RegExp(escapeRegex(req.query.search), "i");
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];
        }

        // status filter
        if (req.query.status === "active") {
            filter.isActive = true;
        }

        if (req.query.status === "inactive") {
            filter.isActive = false;
        }

        const [managers, filteredCount, totalCount] = await Promise.all([
            Admin.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Admin.countDocuments(filter),

            Admin.countDocuments({ role: "auctionManager" })
        ]);

        return res.status(200).json({
            success: true,
            data: managers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredCount / limit),
                totalCount,
                filteredCount,
                limit
            }
        });

    } catch (err) {
        console.error("Get Managers Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get manager by id
export const getManagerById = async (req, res) => {
    try {
        const { id } = req.params;

        const manager = await Admin.findOne({
            _id: id,
            role: "auctionManager"
        }).select("-password");

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: "Manager not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: manager
        });

    } catch (err) {
        console.error("Get Manager By ID Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// edit permissions
export const editManagerPermissions = async (req, res) => {
    try {
        const { id } = req.params;

        const { permissions } = req.body;

        if (!permissions) {
            return res.status(400).json({
                success: false,
                message: "Permissions are required"
            });
        }

        const manager = await Admin.findOne({ _id: id, role: "auctionManager" });

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: "Manager not found"
            });
        }

        // if (!manager.isActive) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Cannot edit permissions of a deactivated manager. Reactivate the manager first."
        //     });
        // }

        let parsedPermissions;
        try {
            parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;
        } catch (e) {
            parsedPermissions = {};
        }

        const permissionKeys = [
            'manageAuctions',
            'manageBids',
            'manageVehicles',
            'manageUsers',
            'managePayments',
            'managePayouts',
            'manageReports'
        ];

        const newPermissions = {};
        permissionKeys.forEach((key) => {
            newPermissions[key] = !!parsedPermissions?.[key];
        });

        const requestedTrueKeys = permissionKeys.filter((key) => newPermissions[key] === true);

        if (requestedTrueKeys.length > 0) {
            const activeManagers = await Admin.find({
                role: "auctionManager",
                isActive: true,
                _id: { $ne: id }   // exclude the manager being edited
            });

            const conflicts = [];

            requestedTrueKeys.forEach((key) => {
                const holder = activeManagers.find((mgr) => mgr.permissions?.[key] === true);
                if (holder) {
                    conflicts.push({ permission: key, heldBy: holder.name, managerId: holder._id });
                }
            });


            if (conflicts.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "One or more requested permissions are already assigned to another active manager",
                    conflicts
                });
            }
        }

        manager.permissions = newPermissions;
        await manager.save();

        return res.status(200).json({
            success: true,
            message: "Manager permissions updated successfully",
            data: {
                _id: manager._id,
                name: manager.name,
                permissions: manager.permissions
            }
        });

    } catch (err) {
        console.error("Edit Manager Permissions Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// active / inactive manager
export const toggleManagerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean"
            });
        }

        const manager = await Admin.findOne({ _id: id, role: 'auctionManager' });

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: "Manager not found"
            });
        }

        // Only check when reactivating (false -> true)
        if (isActive === true && manager.isActive === false) {
            const permissionFields = [
                'manageVehicles', 'manageBids', 'manageAuctions',
                'manageUsers', 'managePayments', 'managePayouts', 'manageReports'
                // apni actual 7 permission field names yahan confirm karke daalo
            ];

            const trueFields = permissionFields.filter(f => manager[f] === true);

            if (trueFields.length > 0) {
                const conflictQuery = { isActive: true, _id: { $ne: manager._id } };
                conflictQuery.$or = trueFields.map(f => ({ [f]: true }));

                const conflicts = await Admin.find(conflictQuery).select('name ' + trueFields.join(' '));

                if (conflicts.length > 0) {
                    // build which field conflicts with which manager
                    const conflictDetails = [];
                    for (const c of conflicts) {
                        for (const f of trueFields) {
                            if (c[f] === true) {
                                conflictDetails.push({ field: f, assignedTo: c.name });
                            }
                        }
                    }
                    return res.status(409).json({
                        success: false,
                        message: "Cannot reactivate — permission conflict",
                        conflicts: conflictDetails
                    });
                }
            }
        }

        manager.isActive = isActive;
        await manager.save();

        return res.status(200).json({
            success: true,
            message: `Manager ${isActive ? "Activated" : "Deactivated"} Successfully`,
            data: {
                _id: manager._id,
                name: manager.name,
                email: manager.email,
                isActive: manager.isActive
            }
        });

    } catch (err) {
        console.error("Toggle Manager Status Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// ============================================ BUYER

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

            identityVerification: {
                documentType: identityDocType,
                frontImageUrl, backImageUrl, selfieImageUrl,
                status: 'approved',
                reviewedAt: new Date()
            },

            addressVerification: {
                documentType: addressDocType,
                documentUrl, landlordIdUrl,
                status: 'approved',
                reviewedAt: new Date()
            },

            dob, nationality, country, emirate, city, address, pincode, buyerType, companyName, registrationNumber, vatNumber,

            isEmailVerified: isEmailVerified === 'true' || isEmailVerified === true,
            isMobileVerified: isMobileVerified === 'true' || isMobileVerified === true,

            payment: { method: paymentMethod },

            status: 'approved',
            createdBy: req.user.role === 'admin' ? 'admin' : 'auctionManager',
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

        // notify to admin - if manager added
        if (req.user.role === 'auctionManager') {
            const admin = await Admin.findOne({ role: 'admin' });
            if (admin) {
                await createNotification({
                    recipientId: admin._id,
                    recipientType: 'Admin',
                    type: 'buyer_added',
                    title: 'New Buyer Added by Manager',
                    message: `${newBuyer.buyerId} (${newBuyer.firstName} ${newBuyer.lastName}) was added by a manager.`,
                });
            }
        }

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

        // filters
        const filter = {};

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { mobile: searchRegex },
                { buyerId: searchRegex },
            ];
        }

        if (req.query.isEmailVerified === 'true') filter.isEmailVerified = true; // verified buyers
        if (req.query.isEmailVerified === 'false') filter.isEmailVerified = false; // un-verified buyers

        if (req.query.accountStatus) filter.accountStatus = req.query.accountStatus;

        if (req.query.status) filter.status = req.query.status;

        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
        }

        const [buyers, filteredCount, totalCount] = await Promise.all([
            Buyer.find(filter)
                .select('buyerId firstName lastName profileImageUrl email mobile buyerType status accountStatus lastLoginAt createdAt createdBy isEmailVerified identityVerification.status identityVerification.documentType identityVerification.reviewedBy addressVerification.status addressVerification.documentType addressVerification.reviewedBy')
                .populate('identityVerification.reviewedBy', 'name role')
                .populate('addressVerification.reviewedBy', 'name role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Buyer.countDocuments(filter),  // for filtered
            Buyer.countDocuments()   // for un-filtered
        ]);

        res.status(200).json({
            success: true,
            buyers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredCount / limit),
                totalCount,
                filteredCount, // based on current filter
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

// get buyer by id
export const getBuyerById = async (req, res) => {
    try {
        const { id } = req.params;
        const buyer = await Buyer.findById(id)
            .populate('verifiedBy', 'name role')
            .populate('identityVerification.reviewedBy', 'name role')
            .populate('addressVerification.reviewedBy', 'name role');

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
        buyer.isMobileVerified = nowVerified;
        buyer.verifiedBy = req.user.id;   // naya — tracking

        if (wasUnverified && nowVerified) {
            const rawPassword = crypto.randomBytes(6).toString('base64').slice(0, 10);
            buyer.password = await bcrypt.hash(rawPassword, 10);

            await buyer.save();

            const { subject, html } = buildBuyerWelcomeEmail(buyer.email, rawPassword);
            try {
                await sendEmail(buyer.email, subject, html);
            } catch (emailErr) {
                console.error("Verification welcome email failed:", emailErr);
            }
        } else {
            await buyer.save();
        }

        res.status(200).json({
            success: true,
            message: nowVerified ? "Buyer verified and activated" : "Buyer marked unverified"
        });

        try {
            // manager ---> to admin
            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'buyer_verification_changed',
                        title: `Buyer ${nowVerified ? 'Verified' : 'Unverified'} by Manager`,
                        message: `${buyer.buyerId || buyer.email} was marked ${nowVerified ? 'verified' : 'unverified'} by a manager.`,
                    });
                }
            }
            // Sirf unverify-case mein buyer ko notify
            if (!nowVerified) {
                await createNotification({
                    recipientId: buyer._id,
                    recipientType: 'Buyer',
                    type: 'buyer_verification_changed',
                    title: 'Verification Status Changed',
                    message: `Your account has been marked as unverified. Please contact support if you believe this is a mistake.`,
                });
            }
        } catch (notifErr) {
            console.error("Notification error (non-fatal):", notifErr);
        }

    } catch (err) {
        console.error("Toggle Verification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
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
        buyer[fieldKey].reviewedBy = req.user.id;
        buyer[fieldKey].reviewedAt = new Date();
        buyer[fieldKey].rejectionReason = action === 'reject' ? rejectionReason.trim() : undefined;

        if (action === 'reject') {
            buyer.status = 'rejected';
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

        try {
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

            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'buyer_document_reviewed',
                        title: `Buyer ${group} Document ${action === 'approve' ? 'Approved' : 'Rejected'} by Manager`,
                        message: `${buyer.buyerId || buyer.email}'s ${group} verification was ${action}d by a manager.`,
                    });
                }
            }
        } catch (err) {
            console.error("Post-response error (non-fatal):", err);
        }

    } catch (err) {
        console.log("Buyer document verification error : ", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// suspend buyer
export const suspendBuyer = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: "Suspension reason is required"
            });
        }

        const buyer = await Buyer.findById(id);
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        if (buyer.accountStatus === 'suspended') {
            return res.status(400).json({
                success: false,
                message: "Buyer is already suspended"
            });
        }

        buyer.accountStatus = 'suspended';
        buyer.suspendedAt = new Date();
        buyer.suspendedReason = reason.trim();
        buyer.suspendedBy = req.user.id;
        await buyer.save();

        // Send suspension email
        const { subject, html } = buildBuyerSuspendedEmail(buyer.firstName, buyer.suspendedReason);
        try {
            await sendEmail(buyer.email, subject, html);

        } catch (emailError) {
            console.error("Suspension Email Error:", emailError);
        }

        try {
            await createNotification({
                recipientId: buyer._id,
                recipientType: 'Buyer',
                type: 'buyer_suspended',
                title: 'Account Suspended',
                message: `Your account has been suspended. Reason: ${buyer.suspendedReason}`,
            });

            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'buyer_suspended',
                        title: 'Buyer Suspended by Manager',
                        message: `${buyer.buyerId || buyer.email} was suspended by a manager. Reason: ${buyer.suspendedReason}`,
                    });
                }
            }
        } catch (notifErr) {
            console.error("Notification error (non-fatal):", notifErr);
        }

        return res.status(200).json({
            success: true,
            message: "Buyer suspended successfully"
        });

    } catch (err) {
        console.error("Suspend Buyer Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// reactivate buyer 
export const reactivateBuyer = async (req, res) => {
    try {
        const { id } = req.params;

        const buyer = await Buyer.findById(id);
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found"
            });
        }

        if (buyer.accountStatus === 'active') {
            return res.status(400).json({
                success: false,
                message: "Buyer is already active"
            });
        }

        buyer.accountStatus = 'active';
        buyer.suspendedAt = undefined;
        buyer.suspendedReason = undefined;
        buyer.reactivatedBy = req.user.id;
        buyer.reactivatedAt = new Date();
        await buyer.save();

        // Send reactivation email
        const { subject, html } = buildBuyerReactivatedEmail(buyer.firstName);
        try {
            await sendEmail(buyer.email, subject, html);
        } catch (emailError) {
            console.error("Reactivation Email Error:", emailError);
        }

        try {
            await createNotification({
                recipientId: buyer._id,
                recipientType: 'Buyer',
                type: 'buyer_reactivated',
                title: 'Account Reactivated',
                message: `Your account has been reactivated. You can now use all features.`,
            });

            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'buyer_reactivated',
                        title: 'Buyer Reactivated by Manager',
                        message: `${buyer.buyerId || buyer.email} was reactivated by a manager.`,
                    });
                }
            }
        } catch (notifErr) {
            console.error("Notification error (non-fatal):", notifErr);
        }

        return res.status(200).json({
            success: true,
            message: "Buyer reactivated successfully"
        });

    } catch (err) {
        console.error("Reactivate Buyer Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// buyer stats
export const getBuyerStats = async (req, res) => {
    try {
        const [totalBuyers, verifiedBuyers, activeBuyers, suspendedBuyers] = await Promise.all([
            Buyer.countDocuments(),
            Buyer.countDocuments({ isEmailVerified: true }),
            Buyer.countDocuments({ accountStatus: 'active' }),
            Buyer.countDocuments({ accountStatus: 'suspended' }),
        ]);

        return res.status(200).json({
            success: true,
            totalBuyers,
            verifiedBuyers,
            activeBuyers,
            suspendedBuyers,
        });

    } catch (err) {
        console.error("Get Buyer Stats Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// update buyer -------------------CHATGPT
export const updateBuyer = async (req, res) => {
    let newProfileImageUploaded = false;

    try {
        const { id } = req.params;

        const buyer = await Buyer.findById(id);

        if (!buyer) {
            if (req.files) {
                await deleteCloudinaryFiles(req.files);
            }

            return res.status(404).json({
                success: false,
                message: "Buyer not found",
            });
        }

        const editableFields = [
            "firstName",
            "lastName",
            "gender",
            "dob",
            "nationality",
            "email",
            "mobile",
            "country",
            "emirate",
            "city",
            "address",
            "pincode",
            "buyerType",
            "companyName",
            "registrationNumber",
            "vatNumber",
        ];

        const updates = {};

        editableFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        });

        // Validate required fields if provided
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "mobile",
        ];

        for (const field of requiredFields) {
            if (
                Object.prototype.hasOwnProperty.call(updates, field) &&
                (typeof updates[field] !== "string" ||
                    !updates[field].trim())
            ) {
                if (req.files) {
                    await deleteCloudinaryFiles(req.files);
                }

                return res.status(400).json({
                    success: false,
                    message: `${field} cannot be empty`,
                });
            }
        }

        // Normalize email and mobile
        if (updates.email !== undefined) {
            updates.email = updates.email.trim().toLowerCase();
        }

        if (updates.mobile !== undefined) {
            updates.mobile = updates.mobile.trim();
        }

        // Check duplicate email
        if (
            updates.email !== undefined &&
            updates.email !== buyer.email
        ) {
            const existingEmail = await Buyer.findOne({
                email: updates.email,
                _id: { $ne: id },
            });

            if (existingEmail) {
                if (req.files) {
                    await deleteCloudinaryFiles(req.files);
                }

                return res.status(409).json({
                    success: false,
                    message: "Email is already registered",
                });
            }

            // New email must be verified again
            updates.isEmailVerified = false;
        }

        // Check duplicate mobile
        if (
            updates.mobile !== undefined &&
            updates.mobile !== buyer.mobile
        ) {
            const existingMobile = await Buyer.findOne({
                mobile: updates.mobile,
                _id: { $ne: id },
            });

            if (existingMobile) {
                if (req.files) {
                    await deleteCloudinaryFiles(req.files);
                }

                return res.status(409).json({
                    success: false,
                    message: "Mobile number is already registered",
                });
            }
        }

        // Handle new profile image
        const newProfileImage = req.files?.profileImageUrl?.[0];

        if (newProfileImage) {
            newProfileImageUploaded = true;
            updates.profileImageUrl = newProfileImage.path;
        }

        // Store old image before updating
        const oldProfileImageUrl = buyer.profileImageUrl;

        // Update only permitted fields
        Object.assign(buyer, updates);

        await buyer.save();

        // Delete old image only after successful DB save
        if (
            newProfileImage &&
            oldProfileImageUrl &&
            oldProfileImageUrl !== newProfileImage.path
        ) {
            await deleteOldFileFromCloudinary(oldProfileImageUrl);
        }

        const buyerToReturn = buyer.toObject();
        delete buyerToReturn.password;

        return res.status(200).json({
            success: true,
            message: "Buyer updated successfully",
            data: {
                buyer: buyerToReturn,
            },
        });

    } catch (err) {
        // Clean up new upload if update fails
        if (newProfileImageUploaded && req.files) {
            await deleteCloudinaryFiles(req.files);
        }

        // Handle MongoDB duplicate-key errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0];

            return res.status(409).json({
                success: false,
                message: `${field || "Field"} is already registered`,
            });
        }

        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        console.error("Update Buyer Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error occurred",
        });
    }
};

// ============================================ SELLER

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
            createdBy: req.user.role === 'admin' ? 'admin' : 'auctionManager',
            isEmailVerified: isEmailVerified === 'true' || isEmailVerified === true,
            isPhoneVerified: isPhoneVerified === 'true' || isPhoneVerified === true,
            registrationStep: 7,           // treat as fully complete; wizard doesn't apply here
            addedByAdminId: req.user.id,
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

        // notify to admin
        if (req.user.role === 'auctionManager') {
            const admin = await Admin.findOne({ role: 'admin' });
            if (admin) {
                await createNotification({
                    recipientId: admin._id,
                    recipientType: 'Admin',
                    type: 'seller_added',
                    title: 'New Seller Added by Manager',
                    message: `${seller.sellerId} (${seller.fullName}) was added by a manager.`,
                });
            }
        }

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

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { sellerId: searchRegex },
                { businessName: searchRegex },
            ];
        }

        if (req.query.isEmailVerified === 'true') filter.isEmailVerified = true; // verified sellers
        if (req.query.isEmailVerified === 'false') filter.isEmailVerified = false; // un-verified sellers

        if (req.query.businessType) filter.businessType = req.query.businessType;
        if (req.query.accountStatus) filter.accountStatus = req.query.accountStatus;
        if (req.query.status) filter.status = req.query.status;

        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
        }

        const [sellers, filteredCount, totalCount] = await Promise.all([
            Seller.find(filter)
                .select('sellerId fullName profileImage email phone businessName businessType licenseNumber status accountStatus lastLoginAt createdAt createdBy isEmailVerified tradeLicense emiratesId bankStatement vatCertificate submittedAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Seller.countDocuments(filter),
            Seller.countDocuments({ isComplete: true })   // for un-filtered
        ]);

        res.status(200).json({
            success: true,
            sellers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredCount / limit),
                totalCount,
                filteredCount, // based on current filter
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

// get seller by id
export const getSellerById = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const seller = await Seller.findById(sellerId)
            .populate('addedByAdminId', 'name role')
            .populate('verifiedBy', 'name role')
            .populate('suspendedBy', 'name role')
            .populate('reactivatedBy', 'name role')
            .populate('tradeLicense.reviewedBy', 'name role')
            .populate('emiratesId.reviewedBy', 'name role')
            .populate('bankStatement.reviewedBy', 'name role')
            .populate('vatCertificate.reviewedBy', 'name role');

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
        seller.verifiedBy = req.user.id;

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

        res.status(200).json({
            success: true,
            message: nowVerified ? "Seller verified and activated" : "Seller marked unverified"
        });

        try {
            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'seller_verification_changed',
                        title: `Seller ${nowVerified ? 'Verified' : 'Unverified'} by Manager`,
                        message: `${seller.sellerId || seller.email} was marked ${nowVerified ? 'verified' : 'unverified'} by a manager.`,
                    });
                }
            }
            if (!nowVerified) {
                await createNotification({
                    recipientId: seller._id,
                    recipientType: 'Seller',
                    type: 'seller_verification_changed',
                    title: 'Verification Status Changed',
                    message: `Your account has been marked as unverified. Please contact support if you believe this is a mistake.`,
                });
            }
        } catch (notifErr) {
            console.error("Notification error (non-fatal):", notifErr);
        }

    } catch (err) {
        console.error("Toggle Verification Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
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
        seller[document].reviewedBy = req.user.id;
        seller[document].reviewedAt = new Date();
        seller[document].rejectionReason = action === 'reject' ? rejectionReason.trim() : '';

        // --- NEW: recompute overall seller.status ---
        const mandatoryDocs = ['tradeLicense', 'emiratesId', 'bankStatement'];
        const allDocs = [...mandatoryDocs, 'vatCertificate'];

        const hasRejected = allDocs.some(d => seller[d]?.url && seller[d].status === 'rejected');
        const mandatoryApproved = mandatoryDocs.every(d => seller[d]?.status === 'approved');
        const vatOk = !seller.vatCertificate?.url || seller.vatCertificate.status === 'approved';

        // seller.status = hasRejected ? 'pending' : (mandatoryApproved && vatOk ? 'approved' : 'pending');
        seller.status = hasRejected ? 'rejected' : (mandatoryApproved && vatOk ? 'approved' : 'pending');

        await seller.save();

        const sellerToReturn = seller.toObject();
        delete sellerToReturn.password;

        res.status(200).json({
            success: true,
            message: `${document} verification ${action}d successfully`,
            data: sellerToReturn
        });

        try {
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

            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'seller_document_reviewed',
                        title: `Seller ${document} Document ${action === 'approve' ? 'Approved' : 'Rejected'} by Manager`,
                        message: `${seller.sellerId || seller.email}'s ${document} verification was ${action}d by a manager.`,
                    });
                }
            }

        } catch (err) {
            console.error("Post-response error (non-fatal):", err);
        }

    } catch (err) {
        console.error("Seller document verification error:", err);

        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// suspend seller
export const suspendSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: "Suspension reason is required"
            });
        }

        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (seller.accountStatus === 'suspended') {
            return res.status(400).json({
                success: false,
                message: "Seller is already suspended"
            });
        }

        seller.accountStatus = 'suspended';
        seller.suspendedAt = new Date();
        seller.suspendedReason = reason.trim();
        seller.suspendedBy = req.user.id;
        await seller.save();

        const { subject, html } = buildSellerSuspendedEmail(seller.fullName, seller.suspendedReason);
        try {
            await sendEmail(seller.email, subject, html);
        } catch (emailError) {
            console.error("Seller Suspension Email Error:", emailError);
        }

        try {
            await createNotification({
                recipientId: seller._id,
                recipientType: 'Seller',
                type: 'seller_suspended',
                title: 'Account Suspended',
                message: `Your account has been suspended. Reason: ${seller.suspendedReason}`,
            });

            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'seller_suspended',
                        title: 'Seller Suspended by Manager',
                        message: `${seller.sellerId || seller.email} was suspended by a manager. Reason: ${seller.suspendedReason}`,
                    });
                }
            }
        } catch (notifErr) {
            console.error("Notification error (non-fatal):", notifErr);
        }

    } catch (err) {
        console.error("Suspend Seller Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// reactivate seller
export const reactivateSeller = async (req, res) => {
    try {
        const { id } = req.params;

        const seller = await Seller.findById(id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (seller.accountStatus === 'active') {
            return res.status(400).json({
                success: false,
                message: "Seller is already active"
            });
        }

        seller.accountStatus = 'active';
        seller.suspendedAt = undefined;
        seller.suspendedReason = undefined;
        seller.reactivatedBy = req.user.id;
        seller.reactivatedAt = new Date();
        await seller.save();

        const { subject, html } = buildSellerReactivatedEmail(seller.fullName);
        try {
            await sendEmail(seller.email, subject, html);
        } catch (emailError) {
            console.error("Seller Reactivation Email Error:", emailError);
        }

        try {
            await createNotification({
                recipientId: seller._id,
                recipientType: 'Seller',
                type: 'seller_reactivated',
                title: 'Account Reactivated',
                message: `Your account has been reactivated. You can now use all features.`,
            });
            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'seller_reactivated',
                        title: 'Seller Reactivated by Manager',
                        message: `${seller.sellerId || seller.email} was reactivated by a manager.`,
                    });
                }
            }
        } catch (notifErr) {
            console.error("Notification error (non-fatal):", notifErr);
        }
    } catch (err) {
        console.error("Reactivate Seller Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// seller stats
export const getSellerStats = async (req, res) => {
    try {
        const [totalSellers, verifiedSellers, activeSellers, suspendedSellers] = await Promise.all([
            Seller.countDocuments({ isComplete: true }),
            Seller.countDocuments({ isEmailVerified: true, isComplete: true }),
            Seller.countDocuments({ accountStatus: 'active', isComplete: true }),
            Seller.countDocuments({ accountStatus: 'suspended', isComplete: true }),
        ]);

        return res.status(200).json({
            success: true,
            totalSellers,
            verifiedSellers,
            activeSellers,
            suspendedSellers,
        });

    } catch (err) {
        console.error("Get Seller Stats Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// update seller -------------------CHATGPT
export const updateSeller = async (req, res) => {
    let sellerSaved = false;

    try {
        const { id } = req.params;

        const seller = await Seller.findById(id);

        if (!seller) {
            if (req.files) await deleteCloudinaryFiles(req.files);

            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const editableFields = [
            'fullName',
            'email',
            'phone',
            'businessName',
            'businessType',
            'licenseNumber',
            'vatNumber',
            'businessYear',
            'employees',
            'website',
            'businessDescription',
            'country',
            'emirate',
            'city',
            'area',
            'streetAddress',
            'building',
            'poBox',
            'zipCode'
        ];

        const updates = {};

        editableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field].trim();
            }
        });

        // Required fields cannot be cleared for a completed seller
        const requiredFields = [
            'fullName',
            'email',
            'phone',
            'businessName',
            'businessType',
            'licenseNumber',
            'businessYear',
            'employees',
            'country',
            'emirate',
            'city',
            'area',
            'streetAddress'
        ];

        const missingFields = requiredFields.filter(
            (field) =>
                updates[field] !== undefined &&
                !updates[field]
        );

        if (missingFields.length) {
            if (req.files) await deleteCloudinaryFiles(req.files);

            return res.status(400).json({
                success: false,
                message: "Required fields cannot be empty",
                fields: missingFields
            });
        }

        // Normalize email and phone
        if (updates.email !== undefined) {
            updates.email = updates.email.toLowerCase().trim();
        }

        if (updates.phone !== undefined) {
            updates.phone = updates.phone.trim();
        }

        // Check duplicate email or phone, excluding current seller
        const duplicateConditions = [];

        if (updates.email !== undefined) {
            duplicateConditions.push({ email: updates.email });
        }

        if (updates.phone !== undefined) {
            duplicateConditions.push({ phone: updates.phone });
        }

        if (duplicateConditions.length) {
            const existingSeller = await Seller.findOne({
                _id: { $ne: seller._id },
                $or: duplicateConditions
            });

            if (existingSeller) {
                if (req.files) await deleteCloudinaryFiles(req.files);

                return res.status(400).json({
                    success: false,
                    message: "Another seller already exists with this email or phone"
                });
            }
        }

        // Reset email verification only if email actually changes
        if (
            updates.email !== undefined &&
            updates.email !== seller.email
        ) {
            updates.isEmailVerified = false;
        }

        // Handle profile image upload
        const newProfileImage = req.files?.profileImage?.[0];
        const oldProfileImage = seller.profileImage;

        if (newProfileImage) {
            updates.profileImage = newProfileImage.path;
        }

        // Apply only allowed updates
        Object.assign(seller, updates);

        await seller.save();
        sellerSaved = true;

        // Delete old image only after the seller is successfully updated
        if (
            newProfileImage &&
            oldProfileImage &&
            oldProfileImage !== newProfileImage.path
        ) {
            await deleteOldFileFromCloudinary(oldProfileImage);
        }

        const updatedSeller = seller.toObject();
        delete updatedSeller.password;

        return res.status(200).json({
            success: true,
            message: "Seller updated successfully",
            seller: updatedSeller
        });

    } catch (error) {
        // Clean up newly uploaded files if the database update failed
        if (!sellerSaved && req.files) {
            await deleteCloudinaryFiles(req.files);
        }

        console.error("Update Seller Error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Seller already exists with this email or phone"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: Object.values(error.errors).map(
                    (item) => item.message
                )
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// ============================================ VEHICLES

// get all makes from DB - for make filter (drop-down)
export const getDistinctMakes = async (req, res) => {
    try {
        const makes = await Vehicle.distinct('make');
        res.status(200).json({ success: true, makes: makes.sort() });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error Occurred" });
    }
};

// get all vehicles
export const getAllVehicles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status } = req.query;

        const filter = status && status !== 'all-requests' ? { adminStatus: status } : {};

        // search 
        if (req.query.search) {
            const search = req.query.search.trim();
            const searchRegex = new RegExp(search, 'i');
            const orConditions = [
                { make: searchRegex },
                { model: searchRegex },
                { vin: searchRegex },
                { listingId: searchRegex },
            ];

            const numericSearch = Number(search);
            if (!isNaN(numericSearch)) {
                orConditions.push({ year: numericSearch });
            }

            filter.$or = orConditions;
        }

        if (req.query.vehicleType) filter.vehicleType = req.query.vehicleType;
        if (req.query.make) filter.make = req.query.make;

        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
        }

        const [vehicles, totalCount] = await Promise.all([
            Vehicle.find(filter)
                .select('listingId sellerId images year make model vin bodyType exteriorColor transmission adminStatus rejectionReason reviewedAt reviewedBy createdAt')
                .populate({
                    path: 'sellerId',
                    select: 'fullName sellerId email phone profileImage'
                })
                .populate({
                    path: 'reviewedBy',
                    select: 'name profilePhoto role'
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

// get vehcile by id
export const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id)
            .populate("sellerId", "fullName email phone profileImage status")
            .populate("reviewedBy", "name role");

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
            // sirf pehli baar (draft) approve pe upcoming; unsold/canceled/etc. ka status mat chhedo
            if (vehicle.auctionStatus === 'draft') {
                vehicle.auctionStatus = 'upcoming';
            }
        } else {
            vehicle.adminStatus = 'rejected';
            vehicle.rejectionReason = rejectionReason.trim();
            vehicle.reviewedAt = Date.now();
            vehicle.reviewedBy = req.user.id;
        }

        await vehicle.save();

        const windowPassed =
            action === 'approve' &&
            vehicle.auctionStatus === 'upcoming' &&
            (!vehicle.auctionEndDateTime || vehicle.auctionEndDateTime <= new Date());

        const role = req.user.role; // 'admin' or 'auctionManager'
        const actionLabel = action === 'approve' ? 'approved' : 'rejected';

        // notification to seller - if approve/rejected by admin or manager
        await createNotification({
            recipientId: vehicle.sellerId,
            recipientType: 'Seller',
            type: 'vehicle_reviewed',
            vehicleId: vehicle._id,
            title: `Vehicle ${actionLabel === 'approved' ? 'Approved' : 'Rejected'}`,
            message: role === 'admin'
                ? `${vehicle.listingId} was ${actionLabel} by admin.${action === 'reject' ? ' Reason: ' + rejectionReason.trim() : ''}`
                : `${vehicle.listingId} was ${actionLabel} by a manager.${action === 'reject' ? ' Reason: ' + rejectionReason.trim() : ''}`
        });

        // notification to admin - if approve/rejected by manager
        if (role === 'auctionManager') {
            const admin = await Admin.findOne({ role: 'admin' });
            if (admin) {
                await createNotification({
                    recipientId: admin._id,
                    recipientType: 'Admin',
                    type: 'vehicle_reviewed',
                    vehicleId: vehicle._id,
                    title: `Vehicle ${actionLabel === 'approved' ? 'Approved' : 'Rejected'} by Manager`,
                    message: `${vehicle.listingId} was ${actionLabel} by a manager.${action === 'reject' ? ' Reason: ' + rejectionReason.trim() : ''}`
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Vehicle ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
            data: vehicle,
            windowPassed
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

// edit vehicle

const MAX_IMAGES = 15;
const MAX_DOCS = 5;
const MAX_HISTORY = 50;

const TEXT_FIELDS = [
    'vehicleType', 'make', 'model', 'trim', 'bodyType', 'transmission', 'fuelType',
    'drivetrain', 'exteriorColor', 'interiorColor', 'vehicleDescription',
    'country', 'emirate', 'city', 'zipCode', 'titleStatus', 'accidentHistory',
    'overallCondition', 'mechanicalCondition', 'interiorCondition', 'exteriorCondition',
    'doors', 'seats', 'engineSize', 'cylinders', 'keyType', 'additionalFeatures',
    'repainted', 'smokeOdor', 'petFriendly', 'paintType', 'glassCondition',
    'tiresCondition', 'tireBrand', 'tireSize', 'seatMaterial', 'sunroof',
    'acHeater', 'audioSystem', 'navigation', 'powerWindows', 'powerLocks', 'additionalNotes',
];
const NUMBER_FIELDS = ['year', 'mileage', 'numberOfKeys'];

// Ek hi jagah rule: seller edit API baad mein isi ko extend karegi
export const checkAdminEditable = (vehicle) => {
    if (vehicle.adminStatus === 'rejected') {
        return 'Rejected vehicles cannot be edited. The seller must edit and resubmit.';
    }
    if (vehicle.auctionStatus === 'sold') {
        return 'Sold vehicles cannot be edited.';
    }
    return null;
};

const parseIds = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v.map(String);
    const s = String(v).trim();
    if (s.startsWith('[')) {
        try { return JSON.parse(s).map(String); } catch { return null; }
    }
    return s.split(',').map((x) => x.trim()).filter(Boolean);
};

// editHistory document bada na ho
const short = (v) => (typeof v === 'string' && v.length > 300 ? v.slice(0, 300) + '…' : v);

export const adminEditVehicle = async (req, res) => {

    const fail = async (status, message) => {
        await deleteCloudinaryFiles(req.files);
        return res.status(status).json({ success: false, message });
    };

    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return fail(404, 'Vehicle not found');

        const vehicle = await Vehicle.findById(id).select('+editHistory');
        if (!vehicle) return fail(404, 'Vehicle not found');

        const blocked = checkAdminEditable(vehicle);
        if (blocked) return fail(400, blocked);

        const body = req.body;
        const files = req.files || {};
        const changes = [];

        // ---------- text / number fields ----------
        const fields = [...TEXT_FIELDS, ...NUMBER_FIELDS];
        if (vehicle.adminStatus === 'pending') fields.push('vin');

        for (const field of fields) {
            if (body[field] === undefined) continue;

            let incoming = typeof body[field] === 'string' ? body[field].trim() : body[field];
            if (field === 'vin') incoming = String(incoming).toUpperCase();

            if (incoming === '') {
                if (Vehicle.schema.path(field).isRequired) return fail(400, `${field} is required`);
                incoming = undefined;
            } else if (NUMBER_FIELDS.includes(field)) {
                incoming = Number(incoming);
                if (!Number.isFinite(incoming) || incoming < 0) {
                    return fail(400, `${field} must be a valid number`);
                }
            }
            const current = vehicle[field];
            if (String(current ?? '') === String(incoming ?? '')) continue;

            changes.push({ field, from: short(current ?? null), to: short(incoming ?? null) });
            vehicle[field] = incoming;
        }

        // ---------- year range (addVehicle jaisa) ----------
        if (vehicle.isModified('year')) {
            const maxYear = new Date().getFullYear() + 1;
            if (vehicle.year < 1980 || vehicle.year > maxYear) {
                return fail(400, `Year must be between 1980 and ${maxYear}`);
            }
        }

        // ---------- VIN duplicate (addVehicle jaisa) ----------
        if (vehicle.isModified('vin')) {
            const dup = await Vehicle.findOne({
                _id: { $ne: vehicle._id },
                vin: vehicle.vin,
                auctionStatus: { $in: ['draft', 'upcoming', 'live'] },
            }).select('_id');
            if (dup) return fail(400, 'An active listing already exists for this VIN');
            vehicle.vinDecoded = false;
        }

        // ---------- images / documents ----------
        const removeImageIds = parseIds(body.removeImageIds);
        const removeDocIds = parseIds(body.removeDocumentIds);

        if (removeImageIds === null || removeDocIds === null) {
            return fail(400, 'Invalid remove list');
        }

        const removedImages = vehicle.images.filter((i) => removeImageIds.includes(String(i._id)));
        const removedDocs = vehicle.documents.filter((d) => removeDocIds.includes(String(d._id)));

        if (
            removedImages.length !== new Set(removeImageIds).size ||
            removedDocs.length !== new Set(removeDocIds).size
        ) {
            return fail(400, 'Some files to remove were not found on this vehicle');
        }

        const newImages = (files.images || []).map((f) => ({
            url: f.path, publicId: f.filename, resourceType: 'image',
        }));
        const newDocs = (files.documents || []).map((f) => ({
            url: f.path,
            publicId: f.filename,
            resourceType: f.mimetype === 'application/pdf' ? 'raw' : 'image',
            name: f.originalname,
        }));

        const imagesBefore = vehicle.images.length;
        const docsBefore = vehicle.documents.length;
        const imagesAfter = imagesBefore - removedImages.length + newImages.length;
        const docsAfter = docsBefore - removedDocs.length + newDocs.length;

        if (imagesAfter < 1) return fail(400, 'At least one image is required');
        if (imagesAfter > MAX_IMAGES) return fail(400, `Maximum ${MAX_IMAGES} images allowed`);
        if (docsAfter > MAX_DOCS) return fail(400, `Maximum ${MAX_DOCS} documents allowed`);

        const toDelete = [
            ...removedImages.map((i) => ({ publicId: i.publicId, type: i.resourceType || 'image' })),
            ...removedDocs.map((d) => ({ publicId: d.publicId, type: d.resourceType || 'raw' })),
        ];

        if (removedImages.length || newImages.length) {
            vehicle.images = [
                ...vehicle.images.filter((i) => !removeImageIds.includes(String(i._id))).map((i) => i.toObject()),
                ...newImages,
            ];
            changes.push({
                field: 'images',
                from: `${imagesBefore} images`,
                to: `${imagesAfter} images (-${removedImages.length}, +${newImages.length})`,
            });
        }

        if (removedDocs.length || newDocs.length) {
            vehicle.documents = [
                ...vehicle.documents.filter((d) => !removeDocIds.includes(String(d._id))).map((d) => d.toObject()),
                ...newDocs,
            ];
            changes.push({
                field: 'documents',
                from: `${docsBefore} documents`,
                to: `${docsAfter} documents (-${removedDocs.length}, +${newDocs.length})`,
            });
        }

        // ---------- koi change nahi ----------
        if (!changes.length) return fail(400, 'No changes');

        // ---------- editHistory (max 50) ----------
        vehicle.editHistory.push({ byRole: req.user.role, byId: req.user.id, changes });
        if (vehicle.editHistory.length > MAX_HISTORY) {
            vehicle.editHistory.splice(0, vehicle.editHistory.length - MAX_HISTORY);
        }

        await vehicle.save({ validateModifiedOnly: true });

        await Promise.all(toDelete.map((f) => deleteStoredFile(f.publicId, f.type)));

        // -------- notification trigger
        try {
            const changedNames = changes.map((c) => c.field).join(', ');
            const byLabel = req.user.role === 'admin' ? 'admin' : 'a manager';

            await createNotification({
                recipientId: vehicle.sellerId,
                recipientType: 'Seller',
                type: 'vehicle_edited',
                vehicleId: vehicle._id,
                title: 'Vehicle Listing Updated',
                message: `${vehicle.listingId} was edited by ${byLabel}. Updated: ${changedNames}.`,
            });

            if (req.user.role === 'auctionManager') {
                const admin = await Admin.findOne({ role: 'admin' });
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientType: 'Admin',
                        type: 'vehicle_edited',
                        vehicleId: vehicle._id,
                        title: 'Vehicle Edited by Manager',
                        message: `${vehicle.listingId} was edited by a manager. Updated: ${changedNames}.`,
                    });
                }
            }
        } catch (notifErr) {
            console.error('adminEditVehicle notification failed:', notifErr.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            changedFields: changes.map((c) => c.field),
        });

    } catch (err) {
        console.log("adminEditVehicle error :", err);
        await deleteCloudinaryFiles(req.files);

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// ============================================ AUCTIONS

// get - all + live + upcoming + completed + canceled auctions 
export const getAllAuctions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status, dateRange, search, vehicleType, fuelType, startDate, endDate, sortBy } = req.query;

        const validStatuses = ['draft', 'upcoming', 'live', 'sold', 'unsold', 'reserve-not-met', 'pending_payment', 'canceled'];

        const filter = {
            adminStatus: 'approved',
        };

        // upcoming
        if (dateRange && status === 'upcoming') {
            const nowUAE = new Date(Date.now() + UAE_UTC_OFFSET_HOURS * 60 * 60 * 1000);

            let startUAE, endUAE;

            if (dateRange === 'today') {
                startUAE = new Date(Date.UTC(nowUAE.getUTCFullYear(), nowUAE.getUTCMonth(), nowUAE.getUTCDate()));
                endUAE = new Date(startUAE.getTime() + 24 * 60 * 60 * 1000);
            } else if (dateRange === 'week') {
                const dayOfWeek = nowUAE.getUTCDay(); // 0 = Sunday
                startUAE = new Date(Date.UTC(nowUAE.getUTCFullYear(), nowUAE.getUTCMonth(), nowUAE.getUTCDate() - dayOfWeek));
                endUAE = new Date(startUAE.getTime() + 7 * 24 * 60 * 60 * 1000);
            } else if (dateRange === 'month') {
                startUAE = new Date(Date.UTC(nowUAE.getUTCFullYear(), nowUAE.getUTCMonth(), 1));
                endUAE = new Date(Date.UTC(nowUAE.getUTCFullYear(), nowUAE.getUTCMonth() + 1, 1));
            }

            if (startUAE && endUAE) {
                // UAE local boundaries ko wapas UTC mein convert karo, kyunki DB mein UTC store hai
                filter.auctionStartDateTime = {
                    $gte: new Date(startUAE.getTime() - UAE_UTC_OFFSET_HOURS * 60 * 60 * 1000),
                    $lt: new Date(endUAE.getTime() - UAE_UTC_OFFSET_HOURS * 60 * 60 * 1000)
                };
            }
        }

        // completed
        if (status === 'completed') {
            filter.auctionStatus = { $in: ['sold', 'unsold', 'reserve-not-met', 'pending_payment'] };
        } else if (status === 'canceled' && req.query.dateRange) {
            filter.auctionStatus = 'canceled';
            filter.statusAtCancellation = req.query.dateRange; // 'upcoming' or 'live'
        } else if (status && status !== 'all' && validStatuses.includes(status)) {
            filter.auctionStatus = status;
        }

        // search + drop-down filter
        if (search) {
            const searchTerm = search.trim();
            const searchRegex = new RegExp(searchTerm, 'i');
            const orConditions = [
                { make: searchRegex },
                { model: searchRegex },
                { vin: searchRegex },
                { listingId: searchRegex },
            ];
            const numericSearch = Number(searchTerm);
            if (!isNaN(numericSearch)) {
                orConditions.push({ year: numericSearch });
            }
            filter.$or = orConditions;
        }

        if (vehicleType) filter.vehicleType = vehicleType;
        if (fuelType) filter.fuelType = fuelType;

        let dateField = 'auctionStartDateTime'; // default: all/live/upcoming
        if (status === 'completed') dateField = 'auctionEndDateTime';
        if (status === 'canceled') dateField = 'canceledAt';

        if (startDate || endDate) {
            filter[dateField] = {};
            if (startDate) filter[dateField].$gte = new Date(startDate);
            if (endDate) filter[dateField].$lte = new Date(endDate);
        }

        // sort by filter
        let sortOption = { createdAt: -1 }; // default
        if (sortBy === 'ending_soon') sortOption = { auctionEndDateTime: 1 };
        else if (sortBy === 'newest') sortOption = { auctionStartDateTime: -1 };
        else if (sortBy === 'highest_bid') sortOption = { currentBid: -1 };

        const [vehicles, totalCount] = await Promise.all([
            Vehicle.find(filter).populate('canceledByUserId', 'name email role').sort(sortOption).skip(skip).limit(limit),
            Vehicle.countDocuments(filter)
        ]);

        // bids + bidders count + sller/buyer bid info
        const vehiclesWithBids = await Promise.all(
            vehicles.map(async (v) => {

                const currentBids = { vehicleId: v._id, status: { $ne: 'archived' } };
                const bidCount = await Bid.countDocuments(currentBids);
                const bidderCount = (await Bid.distinct('bidderId', currentBids)).length;

                let soldTo = null;
                if (v.auctionStatus === 'sold') {
                    const winningBid = await Bid.findOne({ vehicleId: v._id, status: 'won' });

                    if (winningBid) {
                        if (winningBid.bidderType === 'Buyer') {
                            const bidder = await Buyer.findById(winningBid.bidderId).select('firstName lastName email profileImageUrl');
                            if (bidder) {
                                soldTo = {
                                    name: `${bidder.firstName} ${bidder.lastName}`,
                                    email: bidder.email,
                                    profileImageUrl: bidder.profileImageUrl,
                                };
                            }
                        } else if (winningBid.bidderType === 'Seller') {
                            const bidder = await Seller.findById(winningBid.bidderId).select('fullName email profileImage');
                            if (bidder) {
                                soldTo = {
                                    name: bidder.fullName,
                                    email: bidder.email,
                                    profileImageUrl: bidder.profileImage,
                                };
                            }
                        }
                    }
                }

                return { ...v.toObject(), bids: bidCount, bidders: bidderCount, soldTo };
            })
        );

        return res.status(200).json({
            success: true,
            count: vehicles.length,
            vehicles: vehiclesWithBids,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        });
    } catch (err) {
        console.error("Get All Auctions Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get auction detail
export const getAuctionDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await Vehicle.findById(id).populate('canceledByUserId', 'name email role');

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Auction not found"
            });
        }

        // find all bids of this vehicle
        const allBids = await Bid.find({ vehicleId: vehicle._id, status: { $ne: 'archived' } }).sort({ createdAt: -1 });

        const bidsWithBidderInfo = await Promise.all(
            allBids.map(async (bid) => {
                let bidderInfo = null;

                if (bid.bidderType === 'Buyer') {
                    const bidder = await Buyer.findById(bid.bidderId).select('firstName lastName email mobile profileImageUrl');

                    if (bidder) {
                        bidderInfo = {
                            name: `${bidder.firstName} ${bidder.lastName}`,
                            email: bidder.email,
                            phone: bidder.mobile,
                            profileImageUrl: bidder.profileImageUrl,
                        };
                    }
                } else if (bid.bidderType === 'Seller') {
                    const bidder = await Seller.findById(bid.bidderId).select('fullName email phone profileImage');

                    if (bidder) {
                        bidderInfo = {
                            name: bidder.fullName,
                            email: bidder.email,
                            phone: bidder.phone,
                            profileImageUrl: bidder.profileImage,
                        };
                    }
                }

                return {
                    _id: bid._id,
                    bidId: bid.bidId,
                    amount: bid.amount,
                    status: bid.status,
                    bidderType: bid.bidderType,
                    bidderId: bid.bidderId,
                    bidder: bidderInfo,
                    createdAt: bid.createdAt,
                    updatedAt: bid.updatedAt,
                };
            })
        );

        // find only unique bidders
        const participantsMap = {};

        bidsWithBidderInfo.forEach((bid) => {
            const key = bid.bidderId?.toString();
            if (!key) return;

            if (!participantsMap[key]) {
                participantsMap[key] = {
                    bidderId: bid.bidderId,
                    bidderType: bid.bidderType,
                    bidder: bid.bidder,
                    totalBids: 0,
                    firstBidAt: bid.createdAt,
                };
            }

            participantsMap[key].totalBids += 1;
            // firstBidAt ko earliest rakho (kyunki bids latest-first sorted hain)
            if (bid.createdAt < participantsMap[key].firstBidAt) {
                participantsMap[key].firstBidAt = bid.createdAt;
            }
        });

        const participants = Object.values(participantsMap);

        // soldTo (if solded) - find only winning bidder
        let soldTo = null;

        if (vehicle.auctionStatus === 'sold') {
            const winningBid = bidsWithBidderInfo.find(
                (b) => b.status === 'won'
            );
            if (winningBid) {
                soldTo = winningBid.bidder;
            }
        }

        return res.status(200).json({
            success: true,
            message: "Here is the auction detail",
            data: {
                vehicle,
                bids: bidsWithBidderInfo,
                participants,
                soldTo,
                bidsCount: bidsWithBidderInfo.length,
                bidderCount: participants.length,
            }
        });

    } catch (err) {
        console.log("Get Auction Detail Error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// get upcoming auctions for admin calendar
export const getUpcomingAuctionsCalendar = async (req, res) => {
    try {
        const now = new Date();

        const auctions = await Vehicle.find({
            adminStatus: 'approved',
            auctionStatus: 'upcoming',
            auctionStartDateTime: { $gte: now }
        })
            .select(
                'listingId make model year trim auctionStartDateTime auctionStatus'
            )
            .sort({ auctionStartDateTime: 1 });

        const calendarAuctions = auctions.map((vehicle) => ({
            id: vehicle._id,
            listingId: vehicle.listingId,
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`,
            auctionStartDateTime: vehicle.auctionStartDateTime,
            auctionStatus: vehicle.auctionStatus,
        }));

        return res.status(200).json({
            success: true,
            auctions: calendarAuctions,
        });

    } catch (err) {
        console.error("getUpcomingAuctionsCalendar Error:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// Get all auction stats
export const getAllAuctionStats = async (req, res) => {
    try {
        const [totalAuctions, liveAuctions, upcomingAuctions, completedAuctions, canceledAuctions] = await Promise.all([

            Vehicle.countDocuments({ adminStatus: "approved" }),
            Vehicle.countDocuments({ auctionStatus: "live" }),
            Vehicle.countDocuments({
                adminStatus: "approved",
                auctionStatus: "upcoming"
            }),
            Vehicle.countDocuments({
                auctionStatus: {
                    $in: ["sold", "unsold", "reserve-not-met", 'pending_payment']
                }
            }),
            Vehicle.countDocuments({ auctionStatus: "canceled" })
        ]);

        return res.status(200).json({
            success: true,
            message: "All auction stats fetched successfully",
            data: {
                totalAuctions,
                liveAuctions,
                upcomingAuctions,
                completedAuctions,
                canceledAuctions
            }
        });

    } catch (error) {
        console.error("Get all auction stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch all auction stats",
            error: error.message
        });
    }
};

// Get live auction stats
export const getLiveAuctionStats = async (req, res) => {
    try {
        const now = new Date();

        // Next 5 minutes
        const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

        // currently live auctions
        const liveAuctions = await Vehicle.find({
            adminStatus: "approved",
            auctionStatus: "live",
            auctionStartDateTime: { $lte: now },
            auctionEndDateTime: { $gt: now }
        }).select("_id currentBid auctionEndDateTime");

        const liveVehicleIds = liveAuctions.map(
            auction => auction._id
        );

        // Total bids + unique participants
        const liveBidFilter = {
            vehicleId: { $in: liveVehicleIds },
            status: { $ne: "archived" }
        };

        const [totalBids, participants] = await Promise.all([
            Bid.countDocuments(liveBidFilter),
            Bid.distinct("bidderId", liveBidFilter)
        ]);

        // Total current bid value
        const totalValue = liveAuctions.reduce(
            (total, auction) => {
                return total + (auction.currentBid || 0);
            },
            0
        );

        // ending in next 5 minutes
        const endingSoon = liveAuctions.filter(
            auction =>
                auction.auctionEndDateTime > now &&
                auction.auctionEndDateTime <= fiveMinutesLater
        ).length;

        return res.status(200).json({
            success: true,
            message: "Live auction stats fetched successfully",
            data: {
                liveAuctions: liveAuctions.length,
                totalBids,
                totalParticipants: participants.length,
                totalValue,
                endingSoon
            }
        });

    } catch (error) {
        console.error("Get live auction stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch live auction stats",
            error: error.message
        });
    }
};

// Get upcoming auction stats
export const getUpcomingAuctionStats = async (req, res) => {
    try {
        const now = new Date();

        const DUBAI_OFFSET = 4 * 60 * 60 * 1000;
        const dubaiNow = new Date(now.getTime() + DUBAI_OFFSET);

        const year = dubaiNow.getUTCFullYear();
        const month = dubaiNow.getUTCMonth();
        const date = dubaiNow.getUTCDate();

        const todayStart = new Date(Date.UTC(year, month, date) - DUBAI_OFFSET);
        const tomorrowStart = new Date(Date.UTC(year, month, date + 1) - DUBAI_OFFSET);

        const dayOfWeek = dubaiNow.getUTCDay();
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const weekStart = new Date(Date.UTC(year, month, date - daysFromMonday) - DUBAI_OFFSET);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

        const monthStart = new Date(Date.UTC(year, month, 1) - DUBAI_OFFSET);
        const monthEnd = new Date(Date.UTC(year, month + 1, 1) - DUBAI_OFFSET);

        // effective lower-bound: "now" ya window-start, jo bhi later ho
        const effectiveNow = (windowStart) => (windowStart > now ? windowStart : now);

        const baseFilter = {
            adminStatus: "approved",
            auctionStatus: "upcoming"
        };

        const [
            totalUpcoming,
            startingToday,
            startingThisWeek,
            startingThisMonth,
            averageStartingPrice
        ] = await Promise.all([

            Vehicle.countDocuments({
                ...baseFilter,
                auctionStartDateTime: { $gt: now }
            }),

            Vehicle.countDocuments({
                ...baseFilter,
                auctionStartDateTime: {
                    $gte: effectiveNow(todayStart),
                    $lt: tomorrowStart
                }
            }),

            Vehicle.countDocuments({
                ...baseFilter,
                auctionStartDateTime: {
                    $gte: effectiveNow(weekStart),
                    $lt: weekEnd
                }
            }),

            Vehicle.countDocuments({
                ...baseFilter,
                auctionStartDateTime: {
                    $gte: effectiveNow(monthStart),
                    $lt: monthEnd
                }
            }),

            Vehicle.aggregate([
                { $match: { ...baseFilter, auctionStartDateTime: { $gt: now } } },
                { $group: { _id: null, average: { $avg: "$startingBidPrice" } } }
            ])
        ]);

        const avgStartingPrice = Math.round(averageStartingPrice[0]?.average || 0);

        return res.status(200).json({
            success: true,
            message: "Upcoming auction stats fetched successfully",
            data: { totalUpcoming, startingToday, startingThisWeek, startingThisMonth, avgStartingPrice }
        });

    } catch (error) {
        console.error("Get upcoming auction stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming auction stats",
            error: error.message
        });
    }
};

// Get completed auction stats
export const getCompletedAuctionStats = async (req, res) => {
    try {
        const now = new Date();

        const baseFilter = {
            adminStatus: "approved",
            auctionEndDateTime: { $lte: now }
        };

        const [
            totalCompleted,
            soldAuctions,
            unsoldAuctions,
            reserveNotMet
        ] = await Promise.all([

            // Total Completed — sold + unsold + reserve-not-met, sabka sum
            Vehicle.countDocuments({
                ...baseFilter,
                auctionStatus: { $in: ["sold", "unsold", "reserve-not-met", 'pending_payment'] }
            }),

            // Sold
            Vehicle.countDocuments({
                ...baseFilter,
                auctionStatus: "sold"
            }),

            // Unsold
            Vehicle.countDocuments({
                ...baseFilter,
                auctionStatus: "unsold"
            }),

            // Reserve Not Met
            Vehicle.countDocuments({
                ...baseFilter,
                auctionStatus: "reserve-not-met"
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Completed auction stats fetched successfully",
            data: {
                totalCompleted,
                soldAuctions,
                unsoldAuctions,
                reserveNotMet
            }
        });

    } catch (error) {
        console.error("Get completed auction stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch completed auction stats",
            error: error.message
        });
    }
};

// Get canceled auction stats
export const getCanceledAuctionStats = async (req, res) => {
    try {
        const baseFilter = {
            adminStatus: "approved",
            auctionStatus: "canceled"
        };

        const [
            totalCanceled,
            canceledBeforeStart,
            canceledInProgress,
            canceledByAdmin,
            averageStartingPrice
        ] = await Promise.all([

            Vehicle.countDocuments(baseFilter),

            Vehicle.countDocuments({
                ...baseFilter,
                statusAtCancellation: "upcoming"
            }),

            Vehicle.countDocuments({
                ...baseFilter,
                statusAtCancellation: "live"
            }),

            Vehicle.countDocuments({
                ...baseFilter,
                canceledBy: "admin"
            }),

            Vehicle.aggregate([
                { $match: baseFilter },
                { $group: { _id: null, average: { $avg: "$startingBidPrice" } } }
            ])
        ]);

        const avgStartingPrice = Math.round(averageStartingPrice[0]?.average || 0);

        return res.status(200).json({
            success: true,
            message: "Canceled auction stats fetched successfully",
            data: {
                totalCanceled,
                canceledBeforeStart,
                canceledInProgress,
                canceledByAdmin,
                avgStartingPrice
            }
        });

    } catch (error) {
        console.error("Get canceled auction stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch canceled auction stats",
            error: error.message
        });
    }
};

// reschedule / relist 
const REPLANNABLE_STATUSES = ['upcoming', 'unsold', 'reserve-not-met', 'canceled'];
const MIN_LEAD_MS = 60 * 1000;
const TIME_12H = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;

// if notification fail then not give 500
const safeNotify = async (payload) => {
    try {
        await createNotification(payload);
    } catch (err) {
        console.error('reschedule notification failed:', err.message);
    }
};

export const rescheduleAuction = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;
        const { startDate, startTime, duration, reason } = req.body;

        const bad = (message) => res.status(400).json({
            success: false,
            message
        });

        if (!mongoose.Types.ObjectId.isValid(id)) return bad('Invalid auction ID');
        if (!reason || !String(reason).trim()) return bad('Reason is required');

        // ---- input validation ----
        if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate || '')) return bad('startDate must be YYYY-MM-DD');

        const day = new Date(`${startDate}T00:00:00.000Z`);
        if (Number.isNaN(day.getTime()) || day.toISOString().slice(0, 10) !== startDate) {
            return bad('Invalid startDate');
        }

        const timeStr = typeof startTime === 'string' ? startTime.trim() : '';
        if (!TIME_12H.test(timeStr)) return bad('startTime must look like "10:00 AM"');

        const parsed = parseTime12h(timeStr);

        if (!DURATION_MS[duration]) return bad(`Invalid duration: ${duration}`);

        // model ke pre('save') hook wala hi formula (UAE time -> UTC)
        const startDateTime = new Date(day);
        startDateTime.setUTCHours(parsed.hours - UAE_UTC_OFFSET_HOURS, parsed.minutes, 0, 0);
        const endDateTime = new Date(startDateTime.getTime() + DURATION_MS[duration]);

        if (startDateTime.getTime() < Date.now() + MIN_LEAD_MS) {
            return bad('Start time must be at least 1 minute in the future (UAE time)');
        }

        // ---- vehicle checks ----
        const vehicle = await Vehicle.findById(id).select('+scheduleHistory');

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        if (vehicle.adminStatus !== 'approved') return bad('Vehicle is not approved');

        if (vehicle.auctionStatus === 'live') {
            return bad('Live auction cannot be rescheduled. Cancel it first, then relist.');
        }

        if (!REPLANNABLE_STATUSES.includes(vehicle.auctionStatus)) {
            return bad(`Cannot reschedule an auction with status '${vehicle.auctionStatus}'`);
        }

        const fromStatus = vehicle.auctionStatus;
        const isRelist = fromStatus !== 'upcoming';
        const prevStart = vehicle.auctionStartDateTime;
        const prevEnd = vehicle.auctionEndDateTime;
        const cleanReason = String(reason).trim();

        // bidders ko notify karne ke liye, reset se PEHLE
        // (reserve-not-met mein purani bids active/outbid reh jaati hain; canceled ki bids pehle hi 'canceled' hain)
        const affectedBids = isRelist
            ? await Bid.find({ vehicleId: vehicle._id, status: { $in: ['active', 'outbid'] } })
                .select('bidderId bidderType')
            : [];

        // ---- vehicle update ----
        vehicle.auctionStartDate = day;
        vehicle.auctionStartTime = timeStr;
        vehicle.auctionDuration = duration;
        vehicle.markModified('auctionStartTime');

        if (isRelist) {
            vehicle.auctionStatus = 'upcoming';
            vehicle.currentBid = null;
            vehicle.extensionCount = 0;
            vehicle.soldOn = null;
            vehicle.statusAtCancellation = null;
            vehicle.canceledBy = null;
            vehicle.canceledByUserId = null;
            vehicle.cancellationReason = null;
            vehicle.canceledAt = null;
            vehicle.relistCount = (vehicle.relistCount || 0) + 1;
        }

        vehicle.scheduleHistory.push({
            at: new Date(),
            byRole: role,
            byId: userId,
            mode: isRelist ? 'relisted' : 'rescheduled',
            fromStatus,
            prevStartDateTime: prevStart,
            prevEndDateTime: prevEnd,
            newStartDateTime: startDateTime,
            newEndDateTime: endDateTime,
            reason: cleanReason,
        });

        await vehicle.save();

        // ---- old bids archive (not delete) ----
        if (isRelist) {
            try {
                await Bid.updateMany(
                    { vehicleId: vehicle._id, status: { $in: ['active', 'outbid', 'canceled'] } },
                    { $set: { status: 'archived' } }
                );
            } catch (bidErr) {
                console.error('CRITICAL: relist ke baad bids archive nahi hui, vehicle', vehicle._id, bidErr);
            }
        }

        // ---- notifications ----
        const verb = isRelist ? 'relisted' : 'rescheduled';
        const byLabel = role === 'admin' ? 'admin' : 'a manager';
        const when = `${startDate} ${timeStr} (UAE time)`;
        const notifType = isRelist ? 'auction_relisted' : 'auction_rescheduled';

        await safeNotify({
            recipientId: vehicle.sellerId,
            recipientType: 'Seller',
            type: notifType,
            vehicleId: vehicle._id,
            title: isRelist ? 'Auction Relisted' : 'Auction Rescheduled',
            message: `${vehicle.listingId} was ${verb} by ${byLabel}. New start: ${when}. Reason: ${cleanReason}`,
        });

        const uniqueBidders = new Map();

        for (const bid of affectedBids) {
            uniqueBidders.set(bid.bidderId.toString(), bid.bidderType);
        }

        for (const [bidderId, bidderType] of uniqueBidders) {
            await safeNotify({
                recipientId: bidderId,
                recipientType: bidderType,
                type: 'auction_relisted',
                vehicleId: vehicle._id,
                title: 'Auction Relisted',
                message: `The auction for ${vehicle.listingId}, which you had a bid on, was relisted and your bid was cleared. New start: ${when}.`,
            });
        }

        if (role === 'auctionManager') {
            const admin = await Admin.findOne({ role: 'admin' });

            if (admin) {
                await safeNotify({
                    recipientId: admin._id,
                    recipientType: 'Admin',
                    type: notifType,
                    vehicleId: vehicle._id,
                    title: isRelist ? 'Auction Relisted by Manager' : 'Auction Rescheduled by Manager',
                    message: `${vehicle.listingId} was ${verb} by a manager. New start: ${when}.`,
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: isRelist ? 'Auction relisted successfully' : 'Auction rescheduled successfully',
            mode: isRelist ? 'relisted' : 'rescheduled',
            vehicle: {
                _id: vehicle._id,
                listingId: vehicle.listingId,
                auctionStatus: vehicle.auctionStatus,
                auctionStartDateTime: vehicle.auctionStartDateTime,
                auctionEndDateTime: vehicle.auctionEndDateTime,
                auctionDuration: vehicle.auctionDuration,
                relistCount: vehicle.relistCount,
            },
        });

    } catch (err) {
        console.log("rescheduleAuction error : ", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// ============================================ BIDS

// get bid stats
export const getBidStats = async (req, res) => {
    try {
        const [totalBids, activeBids, wonBids, outbidBids, withdrawnBids, canceledBids, archivedBids] = await Promise.all([
            Bid.countDocuments(),
            Bid.countDocuments({ status: 'active' }),
            Bid.countDocuments({ status: 'won' }),
            Bid.countDocuments({ status: 'outbid' }),
            Bid.countDocuments({ status: 'withdrawn' }),
            Bid.countDocuments({ status: 'canceled' }),
            Bid.countDocuments({ status: 'archived' })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalBids,
                activeBids,
                wonBids,
                outbidBids,
                withdrawnBids,
                canceledBids,
                archivedBids
            }
        });

    } catch (err) {
        console.error("Get Bid Stats Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get all bids
export const getAllBids = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const {
            status,
            auctionStatus,
            bidderType,
            search,
            startDate,
            endDate
        } = req.query;

        const filter = {};

        // ==================== Bid Status Filter ====================
        if (status && status !== 'all') {
            filter.status = status;
        }

        // ==================== Bidder Type Filter ====================
        if (bidderType && bidderType !== 'all') {
            filter.bidderType =
                bidderType === 'buyer' ? 'Buyer' : 'Seller';
        }

        // ==================== Auction Status Filter ====================
        if (auctionStatus && auctionStatus !== 'all') {
            const vehicles = await Vehicle.find({
                auctionStatus
            }).select('_id');

            const vehicleIds = vehicles.map(vehicle => vehicle._id);

            filter.vehicleId = { $in: vehicleIds };
        }

        // ==================== Search ====================
        if (search) {
            const searchTerm = search.trim();
            const searchRegex = new RegExp(searchTerm, 'i');

            const orConditions = [
                { bidId: searchRegex }
            ];

            // Search vehicles by make, model, VIN
            const matchingVehicles = await Vehicle.find({
                $or: [
                    { make: searchRegex },
                    { model: searchRegex },
                    { vin: searchRegex }
                ]
            }).select('_id');

            const vehicleIds = matchingVehicles.map(vehicle => vehicle._id);

            if (vehicleIds.length > 0) {
                orConditions.push({
                    vehicleId: { $in: vehicleIds }
                });
            }

            // Search buyers by first name / last name
            const matchingBuyers = await Buyer.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex }
                ]
            }).select('_id');

            // Search sellers by full name
            const matchingSellers = await Seller.find({
                fullName: searchRegex
            }).select('_id');

            const bidderIds = [
                ...matchingBuyers.map(buyer => buyer._id),
                ...matchingSellers.map(seller => seller._id)
            ];

            if (bidderIds.length > 0) {
                orConditions.push({
                    bidderId: { $in: bidderIds }
                });
            }

            filter.$or = orConditions;
        }

        // ==================== Date Range ====================
        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        // ==================== Get Bids ====================
        const [bids, totalCount] = await Promise.all([
            Bid.find(filter)
                .select('bidId vehicleId bidderId bidderType amount status createdAt')
                .populate({
                    path: 'vehicleId',
                    select: 'listingId images vin make model year startingBidPrice auctionStatus'
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Bid.countDocuments(filter)
        ]);

        // ==================== Get Bidder Details ====================
        const formattedBids = await Promise.all(
            bids.map(async (bid) => {
                let bidder = null;

                if (bid.bidderType === 'Buyer') {
                    bidder = await Buyer.findById(bid.bidderId)
                        .select(
                            'buyerId profileImageUrl firstName lastName email mobile'
                        );
                }

                if (bid.bidderType === 'Seller') {
                    bidder = await Seller.findById(bid.bidderId)
                        .select(
                            'sellerId profileImage fullName email phone'
                        );
                }

                return {
                    ...bid.toObject(),
                    bidder
                };
            })
        );

        res.status(200).json({
            success: true,
            bids: formattedBids,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        });

    } catch (err) {
        console.error("All Bids Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// get bid detail
export const getBidDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const bid = await Bid.findById(id)
            .select('vehicleId bidderId bidderType bidId amount status createdAt')
            .populate({
                path: 'vehicleId',
                select: `listingId images vin make model year startingBidPrice currentBid priceType buyNowPrice reservePrice
                    auctionStatus auctionStartDateTime auctionEndDateTime auctionDuration`
            });

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: "Bid not found!"
            })
        }

        // get all bids of this vehicle
        const archivedView = bid.status === 'archived';

        const vehicleBids = await Bid.find({
            vehicleId: bid.vehicleId._id,
            status: archivedView ? 'archived' : { $ne: 'archived' },
        })
            .select('bidId bidderId bidderType amount status createdAt')
            .sort({ amount: -1, createdAt: -1 })
            .lean();

        const formattedBids = await Promise.all((
            vehicleBids.map(async (item) => {
                let bidder = null;

                if (item.bidderType === 'Buyer') {
                    bidder = await Buyer.findById(item.bidderId)
                        .select('buyerId profileImageUrl firstName lastName email mobile')
                        .lean();
                }

                if (item.bidderType === 'Seller') {
                    bidder = await Seller.findById(item.bidderId)
                        .select('sellerId profileImage fullName email phone')
                        .lean();
                }
                return {
                    ...item,
                    bidder
                };
            })
        ));

        // winningbidder
        const winningBid = vehicleBids.find(
            (item) => item.status === 'won'
        );

        let winningBidder = null;

        if (winningBid) {
            if (winningBid.bidderType === 'Buyer') {
                winningBidder = await Buyer.findById(winningBid.bidderId)
                    .select(
                        'buyerId profileImageUrl firstName lastName email mobile'
                    )
                    .lean();
            }

            if (winningBid.bidderType === 'Seller') {
                winningBidder = await Seller.findById(winningBid.bidderId)
                    .select(
                        'sellerId profileImage fullName email phone'
                    )
                    .lean();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Bid details fetched successfully",

            bid: {
                ...bid.toObject(),
                winningBidder
            },
            vehicle: bid.vehicleId,
            bids: formattedBids
        });


    } catch (err) {
        console.log("Bid Detail Error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// top bidders
export const getTopBidders = async (req, res) => {
    try {
        const bidders = await Bid.aggregate([
            {
                $match: {
                    status: { $in: ['active', 'outbid', 'won'] },
                    bidderType: { $in: ['Buyer', 'Seller'] }
                }
            },
            {
                $group: {
                    _id: {
                        bidderId: '$bidderId',
                        bidderType: '$bidderType'
                    },
                    totalBids: { $sum: 1 },
                    totalBidAmount: { $sum: '$amount' },
                    vehiclesParticipated: {
                        $addToSet: '$vehicleId'
                    },
                    lastBidAt: { $max: '$createdAt' }
                }
            },
            {
                $lookup: {
                    from: 'buyers',
                    localField: '_id.bidderId',
                    foreignField: '_id',
                    as: 'buyerDetails'
                }
            },
            {
                $lookup: {
                    from: 'sellers',
                    localField: '_id.bidderId',
                    foreignField: '_id',
                    as: 'sellerDetails'
                }
            },
            {
                $addFields: {
                    bidder: {
                        $cond: [
                            { $eq: ['$_id.bidderType', 'Buyer'] },
                            { $arrayElemAt: ['$buyerDetails', 0] },
                            { $arrayElemAt: ['$sellerDetails', 0] }
                        ]
                    }
                }
            },
            {
                $match: {
                    bidder: { $ne: null }
                }
            },
            {
                $project: {
                    _id: 0,
                    bidderId: '$_id.bidderId',
                    bidderType: '$_id.bidderType',
                    name: {
                        $cond: [
                            { $eq: ['$_id.bidderType', 'Buyer'] },
                            {
                                $trim: {
                                    input: {
                                        $concat: [
                                            { $ifNull: ['$bidder.firstName', ''] },
                                            ' ',
                                            { $ifNull: ['$bidder.lastName', ''] }
                                        ]
                                    }
                                }
                            },
                            '$bidder.fullName'
                        ]
                    },
                    email: '$bidder.email',
                    profileImage: {
                        $cond: [
                            { $eq: ['$_id.bidderType', 'Buyer'] },
                            '$bidder.profileImageUrl',
                            '$bidder.profileImage'
                        ]
                    },
                    businessName: {
                        $cond: [
                            { $eq: ['$_id.bidderType', 'Seller'] },
                            '$bidder.businessName',
                            null
                        ]
                    },
                    totalBids: 1,
                    totalBidAmount: 1,
                    totalVehiclesParticipated: {
                        $size: '$vehiclesParticipated'
                    },
                    lastBidAt: 1
                }
            },
            {
                $sort: {
                    totalBids: -1,
                    totalBidAmount: -1,
                    lastBidAt: -1
                }
            },
            {
                $limit: 5
            }
        ]);

        return res.status(200).json({
            success: true,
            message: 'Top bidders fetched successfully',
            data: {
                bidders
            }
        });

    } catch (err) {
        console.log("getTopBidders error:", err);

        return res.status(500).json({
            success: false,
            message: "Server Error Occurred"
        });
    }
};

// ============================================ PAYOUT

// get payouts
export const getAllPayouts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Search filter
        const search = req.query.search?.trim();

        if (search) {
            const regex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'i'
            );

            const [sellers, vehicles, orders] = await Promise.all([
                Seller.find({
                    $or: [
                        { sellerId: regex },
                        { fullName: regex },
                        { businessName: regex },
                        { email: regex },
                    ],
                }).distinct('_id'),

                Vehicle.find({
                    $or: [
                        { listingId: regex },
                        { make: regex },
                        { model: regex },
                        ...(Number.isFinite(Number(search)) && search !== ''
                            ? [{ year: Number(search) }]
                            : []),
                    ],
                }).distinct('_id'),

                Order.find({
                    orderId: regex,
                }).distinct('_id'),
            ]);

            filter.$or = [
                { payoutId: regex },
                { orderId: { $in: orders } },
                { sellerId: { $in: sellers } },
                { vehicleId: { $in: vehicles } },
            ];
        }

        // Date filter: frontend sends startDate and endDate
        const { startDate, endDate, amountRange } = req.query;

        const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
        if (isYMD(startDate) || isYMD(endDate)) {
            filter.createdAt = {};
            if (isYMD(startDate)) filter.createdAt.$gte = new Date(`${startDate}T00:00:00+04:00`);
            if (isYMD(endDate)) filter.createdAt.$lte = new Date(`${endDate}T23:59:59.999+04:00`);
        }

        // Payout amount filter
        if (amountRange) {
            switch (amountRange) {
                case 'under1000':
                    filter.netAmount = { $lt: 1000 };
                    break;

                case '1000to10000':
                    filter.netAmount = { $gte: 1000, $lte: 10000 };
                    break;

                case '10000to50000':
                    filter.netAmount = { $gt: 10000, $lte: 50000 };
                    break;

                case 'above50000':
                    filter.netAmount = { $gt: 50000 };
                    break;
            }
        }

        const [payouts, total] = await Promise.all([
            Payout.find(filter)
                .populate(
                    'sellerId',
                    'sellerId fullName businessName email phone profileImage'
                )
                .populate(
                    'vehicleId',
                    'listingId make model year images'
                )
                .populate(
                    'orderId',
                    'orderId amount paidAt handover status'
                )
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Payout.countDocuments(filter),
        ]);

        const sums = await Payout.aggregate([
            {
                $group: {
                    _id: '$status',
                    total: { $sum: '$netAmount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        const summary = {};

        sums.forEach((s) => {
            summary[s._id] = {
                total: s.total,
                count: s.count,
            };
        });

        // recent activity
        const recent = await Payout.find().sort({ updatedAt: -1 }).limit(5)
            .select('payoutId status netAmount currency updatedAt sellerId')
            .populate('sellerId', 'fullName businessName').lean();

        return res.status(200).json({
            success: true,
            payouts,
            summary,
            recent,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (err) {
        console.log('getAllPayouts error :', err);

        res.status(500).json({
            success: false,
            message: 'Server Error Occured',
        });
    }
};

// get payout by id
export const getPayoutById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return bad(res, 'Invalid payout id');

        const payout = await Payout.findById(id)
            .populate('sellerId', 'sellerId fullName businessName email phone profileImage licenseNumber createdAt')
            .populate('vehicleId', 'listingId make model year images')
            .populate('orderId', 'orderId amount paidAt status source handover')
            .lean();

        if (!payout) return bad(res, 'Payout not found', 404);

        return res.status(200).json({
            success: true,
            message: "Payout detail fetched",
            payout
        });

    } catch (err) {
        console.error('getPayoutById error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// confirm handover - Car buyer ko mil gayi: admin confirm kare -> seller ka payout 'available'
export const confirmHandover = async (req, res) => {
    try {
        const { orderId } = req.params;
        const note = clean(req.body?.note);

        if (!mongoose.isValidObjectId(orderId)) return bad(res, 'Invalid order id');
        if (note.length < 3) return bad(res, 'A note is required (how was the handover verified?)');

        const now = new Date();
        const order = await Order.findOneAndUpdate(
            { _id: orderId, status: 'paid', 'handover.status': { $ne: 'confirmed' } },
            {
                $set: {
                    'handover.status': 'confirmed',
                    'handover.confirmedAt': now,
                    'handover.confirmedBy': req.user.id,
                    'handover.confirmedByRole': req.user.role,
                    'handover.note': note,
                },
                $push: { statusHistory: { status: 'handover_confirmed', at: now, by: req.user.role, note } },
            },
            { new: true }
        ).lean();

        if (!order) {
            const existing = await Order.findById(orderId).select('status handover').lean();
            if (!existing) return bad(res, 'Order not found', 404);
            if (existing.status !== 'paid') return bad(res, `Order is ${existing.status}, payment not completed`);
            return bad(res, 'Handover is already confirmed');
        }

        let payout = await Payout.findOneAndUpdate(
            { orderId: order._id, status: 'on_hold' },
            {
                $set: { status: 'available' },
                $push: { history: { status: 'available', at: now, by: req.user.role, byId: req.user.id, note: `Handover confirmed: ${note}` } },
            },
            { new: true }
        ).lean();

        // payout kisi wajah se bana nahi tha to ab bana do (handover confirmed hone se seedha 'available')
        if (!payout) payout = await createPayoutForOrder(order);

        await notifySafe({
            recipientId: order.sellerId, recipientType: 'Seller', type: 'handover_confirmed',
            vehicleId: order.vehicleId, title: 'Payout available',
            message: `Handover of ${order.listingId} is confirmed. You can now request your payout.`,
        });

        return res.status(200).json({ success: true, message: 'Handover confirmed', payoutStatus: payout?.status || null });

    } catch (err) {
        console.error('confirmHandover error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// mark payout paid
export const markPayoutPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const ref = clean(req.body?.transferReference);

        if (!mongoose.isValidObjectId(id)) return bad(res, 'Invalid payout id');
        if (!ref) return bad(res, 'Bank transfer reference is required');

        const now = new Date();
        const payout = await Payout.findOneAndUpdate(
            { _id: id, status: 'requested' },
            {
                $set: { status: 'paid', paidAt: now, paidBy: req.user.id, transferReference: ref },
                $push: { history: { status: 'paid', at: now, by: req.user.role, byId: req.user.id, note: `Transfer ref: ${ref}` } },
            },
            { new: true }
        ).lean();

        if (!payout) {
            const existing = await Payout.findById(id).select('status').lean();

            if (!existing) return bad(res, 'Payout not found', 404);
            return bad(res, `Only requested payouts can be marked paid (status: ${existing.status})`);
        }

        await notifySafe({
            recipientId:
                payout.sellerId,
            recipientType: 'Seller',
            type: 'payout_paid',
            vehicleId: payout.vehicleId,
            title: 'Payout sent',
            message: `AED ${payout.netAmount} for ${payout.listingId} was transferred to your bank account. Ref: ${ref}.`,
        });

        return res.status(200).json({
            success: true,
            message: 'Payout marked as paid',
            payout
        });

    } catch (err) {
        console.error('markPayoutPaid error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// reject payout request
export const rejectPayoutRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const reason = clean(req.body?.reason);

        if (!mongoose.isValidObjectId(id)) return bad(res, 'Invalid payout id');
        if (!reason) return bad(res, 'Reason is required');

        const now = new Date();
        const payout = await Payout.findOneAndUpdate(
            { _id: id, status: 'requested' },
            {
                $set: { status: 'available' },
                $unset: { requestedAt: '', bankSnapshot: '' },
                $push: { history: { status: 'available', at: now, by: req.user.role, byId: req.user.id, note: `Request rejected: ${reason}` } },
            },
            { new: true }
        ).lean();

        if (!payout) {
            const existing = await Payout.findById(id).select('status').lean();

            if (!existing) return bad(res, 'Payout not found', 404);
            return bad(res, `Only requested payouts can be rejected (status: ${existing.status})`);
        }

        await notifySafe({
            recipientId: payout.sellerId,
            recipientType: 'Seller',
            type: 'payout_rejected',
            vehicleId: payout.vehicleId,
            title: 'Payout request rejected',
            message: `Your payout request for ${payout.listingId} was rejected. Reason: ${reason}. You can fix this and request again.`,
        });

        return res.status(200).json({ success: true, message: 'Payout request rejected', payout });

    } catch (err) {
        console.error('rejectPayoutRequest error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// ============================================ SALES

// get all sales
const SALE_PAYOUT_STATUSES = ['on_hold', 'available', 'requested', 'paid'];
const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
const escRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getAllSales = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const { status, saleType, sortBy, startDate, endDate } = req.query;
        const search = clean(req.query.search);

        const filter = { paidAt: { $exists: true } };

        if (saleType === 'auction' || saleType === 'buy_now') filter.source = saleType;

        // status = payout ka status, ya 'refunded'
        if (status === 'no_payout') {
            const withPayout = await Payout.find().distinct('orderId');
            filter.status = 'paid';
            filter._id = { $nin: withPayout };
        } else if (status === 'refunded') {
            filter.status = 'canceled';
        } else if (SALE_PAYOUT_STATUSES.includes(status)) {
            const orderIds = await Payout.find({ status }).distinct('orderId');
            filter.status = 'paid';
            filter._id = { $in: orderIds };
        }

        // date: paidAt, UAE time (frontend YYYY-MM-DD bhejta hai)
        if (isYMD(startDate)) filter.paidAt.$gte = new Date(`${startDate}T00:00:00+04:00`);
        if (isYMD(endDate)) filter.paidAt.$lte = new Date(`${endDate}T23:59:59.999+04:00`);

        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            const [vehicleIds, sellerIds, buyerIds] = await Promise.all([
                Vehicle.find({ $or: [{ listingId: rx }, { make: rx }, { model: rx }] }).distinct('_id'),
                Seller.find({ $or: [{ fullName: rx }, { businessName: rx }] }).distinct('_id'),
                Buyer.find({ $or: [{ firstName: rx }, { lastName: rx }, { companyName: rx }] }).distinct('_id'),
            ]);

            filter.$or = [
                { orderId: rx },
                { listingId: rx },
                { vehicleId: { $in: vehicleIds } },
                { sellerId: { $in: sellerIds } },
                { buyerId: { $in: [...buyerIds, ...sellerIds] } },
            ];
        }

        const sort = sortBy === 'oldest' ? { paidAt: 1 } : { paidAt: -1 };

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('vehicleId', 'listingId make model year images')
                .populate('sellerId', 'sellerId fullName businessName email')
                .populate({ path: 'buyerId', select: 'firstName lastName fullName companyName businessName email' })
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);

        const payouts = await Payout.find({ orderId: { $in: orders.map((o) => o._id) } })
            .select('orderId payoutId status netAmount commissionAmount commissionPercent')
            .lean();
        const payoutByOrder = new Map(payouts.map((p) => [String(p.orderId), p]));

        const sales = orders.map((o) => {
            const p = payoutByOrder.get(String(o._id));
            const b = o.buyerId;
            const buyerName = b
                ? (o.buyerType === 'Seller'
                    ? (b.businessName || b.fullName)
                    : (b.companyName || `${b.firstName || ''} ${b.lastName || ''}`.trim()))
                : null;

            return {
                _id: o._id,
                orderId: o.orderId,
                listingId: o.listingId,
                source: o.source,
                paidAt: o.paidAt,
                saleAmount: o.amount,
                currency: o.currency,
                status: o.status === 'canceled' ? 'refunded' : (p?.status || 'no_payout'),
                handoverStatus: o.handover?.status || 'pending',
                vehicle: o.vehicleId
                    ? {
                        make: o.vehicleId.make,
                        model: o.vehicleId.model,
                        year: o.vehicleId.year,
                        image: o.vehicleId.images?.[0]?.url || null,
                    }
                    : null,
                seller: o.sellerId
                    ? { name: o.sellerId.businessName || o.sellerId.fullName, email: o.sellerId.email }
                    : null,
                buyer: b ? { name: buyerName, email: b.email, type: o.buyerType } : null,
                payoutId: p?.payoutId || null,
                commissionAmount: p?.commissionAmount ?? null,
                commissionPercent: p?.commissionPercent ?? null,
                payoutAmount: p?.netAmount ?? null,
            };
        });

        // stats: poore platform ke (filter ke hisaab se nahi)
        const [paidAgg, commAgg, refundedCount] = await Promise.all([
            Order.aggregate([
                { $match: { status: 'paid' } },
                { $group: { _id: null, count: { $sum: 1 }, amount: { $sum: '$amount' } } },
            ]),
            Payout.aggregate([
                { $match: { status: { $ne: 'canceled' } } },
                { $group: { _id: null, commission: { $sum: '$commissionAmount' } } },
            ]),
            Order.countDocuments({ status: 'canceled', paidAt: { $exists: true } }),
        ]);

        const totalSales = paidAgg[0]?.count || 0;
        const totalAmount = paidAgg[0]?.amount || 0;

        return res.status(200).json({
            success: true,
            sales,
            stats: {
                totalSales,
                totalAmount,
                totalCommission: commAgg[0]?.commission || 0,
                averageSale: totalSales ? Math.round(totalAmount / totalSales) : 0,
                refundedCount,
            },
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.error('getAllSales error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// ============================================ REFUND

const notifySafe = async (payload) => {
    try {
        await createNotification(payload);
    } catch (err) {
        console.error('[refund] notification failed:', err.message);
    }
};

const OPEN_PAYOUT_STATUSES = ['on_hold', 'available', 'requested'];

// POST /payments/admin/orders/:id/cancel-refund   body: { reason }
// Paid order cancel + buyer ko FULL refund (Stripe) + car wapas 'unsold' (admin relist kar sakta hai)
//
// Order of operations (paise ki baat hai, isliye):
//   1) Payout ko 'canceled' karke LOCK  -> seller request / admin transfer ab nahi ho sakta
//   2) Stripe refund                    -> fail ho to lock wapas hata do, kuchh nahi badlta
//   3) Order canceled, car unsold, bid canceled, notifications

export const cancelAndRefundOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : '';

        if (!mongoose.isValidObjectId(id)) return bad(res, 'Invalid order id');
        if (reason.length < 3) return bad(res, 'A reason is required');

        const order = await Order.findById(id).lean();
        if (!order) return bad(res, "Order Not Found", 404);

        if (order.status !== 'paid') return bad(res, `Only paid orders can be refunded (order is ${order.status})`);

        const pi = order.stripePaymentIntentId;
        if (!pi) return bad(res, 'No Stripe payment found for this order');

        const now = new Date();

        // ---- 1) lock via payout ----
        const locked = await Payout.findOneAndUpdate(
            { orderId: order._id, status: { $in: OPEN_PAYOUT_STATUSES } },
            {
                $set: { status: 'canceled' },
                $push: { history: { status: 'canceled', at: now, by: req.user.role, byId: req.user.id, note: `Order canceled & refunded: ${reason}` } },
            },
            { new: false }
        ).lean();

        const revertLock = async (why) => {
            if (!locked) return;
            await Payout.updateOne(
                { _id: locked._id, status: 'canceled' },
                {
                    $set: { status: locked.status },
                    $push: { history: { status: locked.status, at: new Date(), by: 'system', note: why } },
                }
            );
        };

        if (!locked) {
            const existing = await Payout.findOne({ orderId: order._id }).select('status').lean();
            // payout hi nahi bana tha, ya pichli attempt beech me ruki thi (canceled) -> aage badho
            if (existing && existing.status !== 'canceled') {
                return bad(res, `Seller payout is already ${existing.status}. This cannot be auto-refunded, handle it manually.`);
            }
        }

        // ---- 2) Stripe refund ----
        let refund;
        try {
            refund = await getStripe().refunds.create(
                { payment_intent: pi, metadata: { orderId: order.orderId, reason: 'admin_cancel' } },
                { idempotencyKey: `refund_admin_${pi}` }
            );
        } catch (err) {
            if (err?.code === 'charge_already_refunded') {
                refund = { id: null, status: 'succeeded' };       // pehle ho chuka tha
            } else {
                console.error('[refund] Stripe refund failed:', err.message);
                await revertLock('Refund failed, cancel reverted');

                await PaymentEvent.create({
                    type: 'refund.admin',
                    orderId: order._id,
                    paymentIntentId: pi,
                    amount: Math.round(order.amount * 100),
                    currency: 'aed',
                    outcome: 'refund_failed',
                    processed: true,
                    note: err.message,
                });
                return bad(res, 'Refund failed at the payment gateway. Nothing was changed, try again.', 502);
            }
        }

        if (refund.status === 'failed' || refund.status === 'canceled') {
            await revertLock('Refund failed, cancel reverted');
            return bad(res, 'Refund was not accepted by the payment gateway. Nothing was changed.', 502);
        }

        // ---- 3) Order / vehicle / bid ----
        const canceled = await Order.findOneAndUpdate(
            { _id: order._id, status: 'paid' },
            {
                $set: {
                    status: 'canceled',
                    isOpen: false,                    // new order can make from this vehicle
                    canceledAt: now,
                    'refund.status': refund.status,
                    'refund.stripeRefundId': refund.id,
                    'refund.amount': order.amount,
                    'refund.reason': reason,
                    'refund.refundedAt': now,
                    'refund.refundedBy': req.user.id,
                },
                $push: { statusHistory: { status: 'canceled', at: now, by: req.user.role, note: `Refunded: ${reason}` } },
            },
            { new: true }
        ).lean();

        await PaymentEvent.create({
            type: 'refund.admin',
            orderId: order._id,
            paymentIntentId: pi,
            amount: Math.round(order.amount * 100),
            currency: 'aed',
            outcome: 'refunded_admin',
            processed: true,
            note: reason,
        });

        if (!canceled) {
            return res.status(200).json({
                success: true,
                message: 'Order was already canceled'
            });
        }

        // vehicle can be relisted
        await Vehicle.updateOne(
            { _id: order.vehicleId, auctionStatus: 'sold' },
            { $set: { auctionStatus: 'unsold', soldOn: null } }
        );

        // 'won' bid ko 'canceled': relist par archive hogi, home page par galat 'sold' winner nahi dikhega
        if (order.bidId) {
            await Bid.updateOne({ _id: order.bidId, status: 'won' }, { $set: { status: 'canceled' } });
        }

        await notifySafe({
            recipientId: order.buyerId,
            recipientType: order.buyerType,
            type: 'purchase_canceled',
            vehicleId: order.vehicleId,
            title: 'Order canceled and refunded',
            message: `Your order for ${order.listingId} was canceled and AED ${order.amount} is being refunded to your card. Reason: ${reason}`,
        });

        await notifySafe({
            recipientId: order.sellerId,
            recipientType: 'Seller',
            type: 'order_canceled',
            vehicleId: order.vehicleId,
            title: 'Sale canceled',
            message: `The sale of ${order.listingId} was canceled and the buyer was refunded. The vehicle is unsold and can be relisted by admin. Reason: ${reason}`,
        });

        return res.status(200).json({
            success: true,
            message: 'Order canceled and refunded',
            refundStatus: refund.status
        });

    } catch (err) {
        console.log("cancelAndRefundOrder Error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

const REFUND_OUTCOMES = ['refunded_admin', 'refunded_late', 'refunded_duplicate', 'amount_mismatch', 'refund_failed'];
const REFUND_KINDS = ['admin', 'late', 'duplicate', 'mismatch', 'auto_failed'];
const REFUND_STATUSES = ['completed', 'pending', 'failed'];

const refundKindOf = (e) => {
    if (e.type === 'refund.admin') return 'admin';
    if (e.outcome === 'refunded_late') return 'late';
    if (e.outcome === 'refunded_duplicate') return 'duplicate';
    if (e.outcome === 'amount_mismatch') return 'mismatch';
    return 'auto_failed';
};

const refundStatusOf = (e, order) => {
    if (e.outcome === 'refund_failed') return 'failed';
    if (e.outcome === 'refunded_admin') {
        const s = order?.refund?.status;
        if (s === 'succeeded') return 'completed';
        if (s === 'failed' || s === 'canceled') return 'failed';
        return 'pending';
    }
    return 'completed';
};

const REFUND_KIND_EXPR = {
    $switch: {
        branches: [
            { case: { $eq: ['$type', 'refund.admin'] }, then: 'admin' },
            { case: { $eq: ['$outcome', 'refunded_late'] }, then: 'late' },
            { case: { $eq: ['$outcome', 'refunded_duplicate'] }, then: 'duplicate' },
            { case: { $eq: ['$outcome', 'amount_mismatch'] }, then: 'mismatch' },
        ],
        default: 'auto_failed',
    },
};

const REFUND_STATUS_EXPR = {
    $switch: {
        branches: [
            { case: { $eq: ['$outcome', 'refund_failed'] }, then: 'failed' },
            {
                case: { $eq: ['$outcome', 'refunded_admin'] },
                then: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$order.refund.status', 'succeeded'] }, then: 'completed' },
                            { case: { $in: ['$order.refund.status', ['failed', 'canceled']] }, then: 'failed' },
                        ],
                        default: 'pending',
                    },
                },
            },
        ],
        default: 'completed',
    },
};

const refundBasePipeline = () => [
    { $match: { outcome: { $in: REFUND_OUTCOMES } } },
    { $lookup: { from: 'orders', localField: 'orderId', foreignField: '_id', as: 'order' } },
    { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
    {
        $addFields: {
            kind: REFUND_KIND_EXPR,
            refundStatus: REFUND_STATUS_EXPR,
            // admin refund fail hua tha, baad me retry se order canceled ho gaya
            resolved: {
                $and: [
                    { $eq: ['$type', 'refund.admin'] },
                    { $eq: ['$outcome', 'refund_failed'] },
                    { $eq: ['$order.status', 'canceled'] },
                ],
            },
            orderCode: '$order.orderId',
            listingCode: '$order.listingId',
            stripeRefundId: { $cond: [{ $eq: ['$outcome', 'refunded_admin'] }, '$order.refund.stripeRefundId', null] },
        },
    },
];

const refundParty = (doc, type) => (doc
    ? { name: payPartyName(doc, type), email: doc.email || null, type }
    : null);

// get all refunds
export const getAllRefunds = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const { status, kind, sortBy, startDate, endDate } = req.query;
        const search = clean(req.query.search);

        const match = {};
        if (REFUND_STATUSES.includes(status)) match.refundStatus = status;
        if (REFUND_KINDS.includes(kind)) match.kind = kind;

        if (isYMD(startDate) || isYMD(endDate)) {
            match.createdAt = {};
            if (isYMD(startDate)) match.createdAt.$gte = new Date(`${startDate}T00:00:00+04:00`);
            if (isYMD(endDate)) match.createdAt.$lte = new Date(`${endDate}T23:59:59.999+04:00`);
        }

        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            const [vehicleIds, sellerIds, buyerIds] = await Promise.all([
                Vehicle.find({ $or: [{ listingId: rx }, { make: rx }, { model: rx }] }).distinct('_id'),
                Seller.find({ $or: [{ sellerId: rx }, { fullName: rx }, { businessName: rx }, { email: rx }] }).distinct('_id'),
                Buyer.find({ $or: [{ buyerId: rx }, { firstName: rx }, { lastName: rx }, { companyName: rx }, { email: rx }] }).distinct('_id'),
            ]);

            const orderIds = await Order.find({
                $or: [
                    { orderId: rx },
                    { listingId: rx },
                    { 'refund.stripeRefundId': rx },
                    { vehicleId: { $in: vehicleIds } },
                    { sellerId: { $in: sellerIds } },
                    { buyerId: { $in: [...buyerIds, ...sellerIds] } },
                ],
            }).distinct('_id');

            match.$or = [{ orderId: { $in: orderIds } }, { paymentIntentId: rx }];
        }

        const dir = sortBy === 'oldest' ? 1 : -1;

        const [result] = await PaymentEvent.aggregate([
            ...refundBasePipeline(),
            {
                $facet: {
                    rows: [
                        { $match: match },
                        { $sort: { createdAt: dir, _id: dir } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        { $project: { order: 0 } },
                    ],
                    total: [{ $match: match }, { $count: 'n' }],

                    // stats poore platform ke (filter ke hisaab se nahi)
                    byStatus: [
                        { $group: { _id: { status: '$refundStatus', resolved: '$resolved' }, count: { $sum: 1 }, amount: { $sum: '$amount' } } },
                    ],

                    // sirf jo paisa actually wapas gaya / ja raha (failed nahi)
                    byKind: [
                        { $match: { refundStatus: { $ne: 'failed' } } },
                        { $group: { _id: '$kind', count: { $sum: 1 }, amount: { $sum: '$amount' } } },
                    ],
                    recent: [
                        { $sort: { createdAt: -1, _id: -1 } },
                        { $limit: 5 },
                        { $project: { order: 0 } },
                    ],
                },
            },
        ]);

        const total = result.total[0]?.n || 0;

        // buyer + vehicle sirf is page ke orders ke liye
        const orderIds = [...new Set(result.rows.map((r) => r.orderId).filter(Boolean).map(String))];
        const orders = orderIds.length
            ? await Order.find({ _id: { $in: orderIds } })
                .populate('vehicleId', 'listingId make model year images')
                .populate({ path: 'buyerId', select: 'firstName lastName fullName companyName businessName email' })
                .lean()
            : [];
        const orderMap = new Map(orders.map((o) => [String(o._id), o]));

        const refunds = result.rows.map((r) => {
            const o = orderMap.get(String(r.orderId));
            const failed = r.outcome === 'refund_failed';
            return {
                _id: r._id,
                orderObjectId: r.orderId || null,
                orderId: r.orderCode || null,
                listingId: r.listingCode || null,
                kind: r.kind,
                status: r.refundStatus,
                resolved: !!r.resolved,
                amount: r.amount != null ? r.amount / 100 : null,
                currency: r.currency ? String(r.currency).toUpperCase() : 'AED',
                reason: failed ? null : (r.note || null),
                failureNote: failed ? (r.note || null) : null,
                stripeRefundId: r.stripeRefundId || null,
                createdAt: r.createdAt,
                vehicle: o?.vehicleId
                    ? { make: o.vehicleId.make, model: o.vehicleId.model, year: o.vehicleId.year, image: payFirstImage(o.vehicleId.images) }
                    : null,
                buyer: o?.buyerId ? refundParty(o.buyerId, o.buyerType) : null,
            };
        });

        // stats
        const stats = {
            total: { count: 0, amount: 0 },
            completed: { count: 0, amount: 0 },
            pending: { count: 0, amount: 0 },
            failed: { count: 0, amount: 0, resolved: 0 },   // failed = abhi bhi open wale
        };

        for (const s of result.byStatus) {
            const { status: st, resolved } = s._id;
            stats.total.count += s.count;
            if (st === 'failed') {
                if (resolved) stats.failed.resolved += s.count;
                else {
                    stats.failed.count += s.count;
                    stats.failed.amount += s.amount / 100;
                }
            } else if (stats[st]) {
                stats[st].count += s.count;
                stats[st].amount += s.amount / 100;
            }
        }
        stats.total.amount = stats.completed.amount + stats.pending.amount;

        const kinds = {};
        REFUND_KINDS.forEach((k) => { kinds[k] = { count: 0, amount: 0 }; });

        for (const k of result.byKind) {
            if (kinds[k._id]) kinds[k._id] = { count: k.count, amount: k.amount / 100 };
        }

        const recent = result.recent.map((r) => ({
            _id: r._id,
            orderId: r.orderCode || null,
            kind: r.kind,
            status: r.refundStatus,
            amount: r.amount != null ? r.amount / 100 : null,
            createdAt: r.createdAt,
        }));

        return res.status(200).json({
            success: true,
            refunds,
            stats,
            kinds,
            recent,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.error('getAllRefunds error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get refund detail
export const getRefundById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) return bad(res, 'Invalid refund id');

        const event = await PaymentEvent.findOne({ _id: id, outcome: { $in: REFUND_OUTCOMES } }).lean();
        if (!event) return bad(res, 'Refund not found', 404);

        const order = event.orderId
            ? await Order.findById(event.orderId)
                .populate('vehicleId', 'listingId make model year images')
                .populate('sellerId', 'sellerId fullName businessName email phone profileImage')
                .populate({
                    path: 'buyerId',
                    select: 'buyerId sellerId firstName lastName fullName companyName businessName email mobile phone profileImageUrl profileImage',
                })
                .populate('refund.refundedBy', 'name')
                .lean()
            : null;

        const events = event.orderId
            ? await PaymentEvent.find({ orderId: event.orderId, outcome: { $in: ['paid', ...REFUND_OUTCOMES] } })
                .sort({ createdAt: 1 }).lean()
            : [event];

        const status = refundStatusOf(event, order);
        const kind = refundKindOf(event);
        const failed = event.outcome === 'refund_failed';
        const resolved = kind === 'admin' && failed && order?.status === 'canceled';

        const b = order?.buyerId;
        const isSellerBuyer = order?.buyerType === 'Seller';
        const s = order?.sellerId;

        const timeline = [
            ...(order?.statusHistory || []).map((h) => ({ source: 'order', status: h.status, at: h.at, by: h.by, note: h.note || null })),
            ...events.map((e) => ({ source: 'gateway', status: e.outcome, at: e.createdAt, by: 'gateway', note: e.note || null })),
        ].sort((x, y) => new Date(x.at) - new Date(y.at));

        const refund = {
            _id: event._id,
            kind,
            status,
            resolved,
            outcome: event.outcome,
            amount: event.amount != null ? event.amount / 100 : null,
            currency: event.currency ? String(event.currency).toUpperCase() : 'AED',
            createdAt: event.createdAt,
            reason: failed ? null : (event.note || null),
            failureNote: failed ? (event.note || null) : null,
            stripePaymentIntentId: event.paymentIntentId || null,
            stripeRefundId: event.outcome === 'refunded_admin' ? (order?.refund?.stripeRefundId || null) : null,
            refundedByName: event.outcome === 'refunded_admin' ? (order?.refund?.refundedBy?.name || null) : null,
            refundedAt: event.outcome === 'refunded_admin' ? (order?.refund?.refundedAt || null) : null,

            // sirf tab jab refund fail hua aur order abhi bhi paid hai -> payment detail se Cancel & Refund dobara chal sakta hai
            retryable: failed && !resolved && order?.status === 'paid',

            order: order
                ? {
                    _id: order._id,
                    orderId: order.orderId,
                    listingId: order.listingId,
                    source: order.source,
                    status: order.status,
                    amount: order.amount,
                    currency: order.currency,
                    paidAt: order.paidAt || null,
                    createdAt: order.createdAt,
                }
                : null,

            vehicle: order?.vehicleId
                ? {
                    listingId: order.vehicleId.listingId,
                    make: order.vehicleId.make,
                    model: order.vehicleId.model,
                    year: order.vehicleId.year,
                    image: payFirstImage(order.vehicleId.images),
                }
                : null,

            buyer: b
                ? {
                    type: order.buyerType,
                    readableId: isSellerBuyer ? b.sellerId : b.buyerId,
                    name: payPartyName(b, order.buyerType),
                    email: b.email || null,
                    phone: (isSellerBuyer ? b.phone : b.mobile) || null,
                    image: (isSellerBuyer ? b.profileImage : b.profileImageUrl) || null,
                }
                : null,

            seller: s
                ? {
                    readableId: s.sellerId,
                    name: payPartyName(s, 'Seller'),
                    email: s.email || null,
                }
                : null,

            timeline,
        };

        return res.status(200).json({ success: true, refund });

    } catch (err) {
        console.error('getRefundById error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// ============================================ ALL PAYMENTS

const PAY_STATUSES = ['pending_payment', 'paid', 'expired', 'canceled'];
const PAY_ALERT_OUTCOMES = ['amount_mismatch', 'refunded_late', 'refunded_duplicate', 'refund_failed'];

const payPartyName = (doc, type) => {
    if (!doc) return null;
    if (type === 'Seller') return doc.businessName || doc.fullName || null;
    return doc.companyName || `${doc.firstName || ''} ${doc.lastName || ''}`.trim() || null;
};

const payFirstImage = (images) => {
    const img = Array.isArray(images) ? images[0] : null;
    return typeof img === 'string' ? img : (img?.url || null);
};

const payIsAlert = (event, orderStatus) =>
    PAY_ALERT_OUTCOMES.includes(event.outcome) &&
    !(event.outcome === 'refund_failed' && orderStatus === 'canceled');

// get all payments
export const getAllPayments = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const { status, saleType, sortBy, startDate, endDate } = req.query;
        const search = clean(req.query.search);

        const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
        const escRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const filter = {};

        if (PAY_STATUSES.includes(status)) filter.status = status;
        if (saleType === 'auction' || saleType === 'buy_now') filter.source = saleType;

        if (isYMD(startDate) || isYMD(endDate)) {
            filter.createdAt = {};
            if (isYMD(startDate)) filter.createdAt.$gte = new Date(`${startDate}T00:00:00+04:00`);
            if (isYMD(endDate)) filter.createdAt.$lte = new Date(`${endDate}T23:59:59.999+04:00`);
        }

        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            const [vehicleIds, sellerIds, buyerIds] = await Promise.all([
                Vehicle.find({ $or: [{ listingId: rx }, { make: rx }, { model: rx }] }).distinct('_id'),
                Seller.find({ $or: [{ sellerId: rx }, { fullName: rx }, { businessName: rx }, { email: rx }] }).distinct('_id'),
                Buyer.find({ $or: [{ buyerId: rx }, { firstName: rx }, { lastName: rx }, { companyName: rx }, { email: rx }] }).distinct('_id'),
            ]);

            filter.$or = [
                { orderId: rx },
                { listingId: rx },
                { vehicleId: { $in: vehicleIds } },
                { sellerId: { $in: sellerIds } },
                { buyerId: { $in: [...buyerIds, ...sellerIds] } },
            ];
        }

        const dir = sortBy === 'oldest' ? 1 : -1;

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('vehicleId', 'listingId make model year images fuelType transmission drivetrain')
                .populate('sellerId', 'fullName businessName')
                .populate({ path: 'buyerId', select: 'firstName lastName fullName companyName businessName email' })
                .sort({ createdAt: dir, _id: dir })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);

        // is page ke orders me gateway alert (auto-refund etc.)
        const alertEvents = orders.length
            ? await PaymentEvent.find({ orderId: { $in: orders.map((o) => o._id) }, outcome: { $in: PAY_ALERT_OUTCOMES } })
                .sort({ createdAt: -1 })
                .select('orderId outcome')
                .lean()
            : [];

        const statusByOrder = new Map(orders.map((o) => [String(o._id), o.status]));
        const alertByOrder = new Map();

        for (const e of alertEvents) {
            const key = String(e.orderId);

            if (!alertByOrder.has(key) && payIsAlert(e, statusByOrder.get(key))) {
                alertByOrder.set(key, e.outcome);
            }
        }

        const payments = orders.map((o) => ({
            _id: o._id,
            orderId: o.orderId,
            listingId: o.listingId,
            source: o.source,
            status: o.status,
            amount: o.amount,
            currency: o.currency,
            createdAt: o.createdAt,
            paidAt: o.paidAt || null,
            paymentDueAt: o.paymentDueAt || null,
            handoverStatus: o.handover?.status || 'pending',
            refundStatus: o.refund?.status || null,
            alert: alertByOrder.get(String(o._id)) || null,
            vehicle: o.vehicleId
                ? {
                    make: o.vehicleId.make,
                    model: o.vehicleId.model,
                    year: o.vehicleId.year,
                    image: payFirstImage(o.vehicleId.images),
                    fuelType: o.vehicleId.fuelType,
                    transmission: o.vehicleId.transmission,
                    drivetrain: o.vehicleId.drivetrain,

                }
                : null,
            buyer: o.buyerId
                ? { name: payPartyName(o.buyerId, o.buyerType), email: o.buyerId.email || null, type: o.buyerType }
                : null,
            seller: o.sellerId ? { name: payPartyName(o.sellerId, 'Seller') } : null,
        }));

        const [byStatus, bySource, recent] = await Promise.all([
            Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } }]),
            Order.aggregate([
                { $match: { status: 'paid' } },
                { $group: { _id: '$source', count: { $sum: 1 }, amount: { $sum: '$amount' } } },
            ]),
            Order.find()
                .sort({ updatedAt: -1 })
                .limit(5)
                .select('orderId listingId status amount currency updatedAt')
                .lean(),
        ]);

        const stats = { total: { count: 0 } };
        PAY_STATUSES.forEach((s) => { stats[s] = { count: 0, amount: 0 }; });
        byStatus.forEach((s) => {
            if (!stats[s._id]) return;
            stats[s._id] = { count: s.count, amount: s.amount };
            stats.total.count += s.count;
        });

        const sources = { auction: { count: 0, amount: 0 }, buy_now: { count: 0, amount: 0 } };
        bySource.forEach((s) => {
            if (sources[s._id]) sources[s._id] = { count: s.count, amount: s.amount };
        });

        return res.status(200).json({
            success: true,
            payments,
            stats,
            sources,
            recent,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.error('getAllPayments error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get payment by id
export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { orderId: id };

        const order = await Order.findOne(query)
            .populate('vehicleId', 'listingId make model year images')
            .populate('sellerId', 'sellerId fullName businessName email phone profileImage')
            .populate({
                path: 'buyerId',
                select: 'buyerId sellerId firstName lastName fullName companyName businessName email mobile phone profileImageUrl profileImage accountStatus',
            })
            .populate('handover.confirmedBy', 'name')
            .populate('refund.refundedBy', 'name')
            .lean();

        if (!order) return bad(res, 'Payment not found', 404);

        const [payout, events] = await Promise.all([
            Payout.findOne({ orderId: order._id }).lean(),
            PaymentEvent.find({ orderId: order._id }).sort({ createdAt: 1 }).lean(),
        ]);

        const b = order.buyerId;
        const isSellerBuyer = order.buyerType === 'Seller';
        const s = order.sellerId;

        const timeline = [
            ...(order.statusHistory || []).map((h) => ({ source: 'order', status: h.status, at: h.at, by: h.by, note: h.note || null })),
            ...(payout?.history || []).map((h) => ({ source: 'payout', status: h.status, at: h.at, by: h.by, note: h.note || null })),
        ].sort((x, y) => new Date(x.at) - new Date(y.at));

        const payment = {
            _id: order._id,
            orderId: order.orderId,
            listingId: order.listingId,
            source: order.source,
            status: order.status,
            amount: order.amount,
            currency: order.currency,

            createdAt: order.createdAt,
            paidAt: order.paidAt || null,
            paymentDueAt: order.paymentDueAt || null,
            expiredAt: order.expiredAt || null,
            canceledAt: order.canceledAt || null,

            stripePaymentIntentId: order.stripePaymentIntentId || null,
            stripeSessionId: order.stripeSessionId || null,

            handover: {
                status: order.handover?.status || 'pending',
                confirmedAt: order.handover?.confirmedAt || null,
                confirmedByName: order.handover?.confirmedBy?.name || null,
                confirmedByRole: order.handover?.confirmedByRole || null,
                note: order.handover?.note || null,
            },

            refund: order.refund?.status
                ? {
                    status: order.refund.status,
                    amount: order.refund.amount ?? null,
                    reason: order.refund.reason || null,
                    refundedAt: order.refund.refundedAt || null,
                    refundedByName: order.refund.refundedBy?.name || null,
                    stripeRefundId: order.refund.stripeRefundId || null,
                }
                : null,

            vehicle: order.vehicleId
                ? {
                    listingId: order.vehicleId.listingId,
                    make: order.vehicleId.make,
                    model: order.vehicleId.model,
                    year: order.vehicleId.year,
                    image: payFirstImage(order.vehicleId.images),
                }
                : null,

            buyer: b
                ? {
                    type: order.buyerType,
                    readableId: isSellerBuyer ? b.sellerId : b.buyerId,
                    name: payPartyName(b, order.buyerType),
                    email: b.email || null,
                    phone: (isSellerBuyer ? b.phone : b.mobile) || null,
                    image: (isSellerBuyer ? b.profileImage : b.profileImageUrl) || null,
                    accountStatus: b.accountStatus || null,
                }
                : null,

            seller: s
                ? {
                    readableId: s.sellerId,
                    name: payPartyName(s, 'Seller'),
                    email: s.email || null,
                    phone: s.phone || null,
                    image: s.profileImage || null,
                }
                : null,

            payout: payout
                ? {
                    _id: payout._id,
                    payoutId: payout.payoutId,
                    status: payout.status,
                    grossAmount: payout.grossAmount,
                    commissionPercent: payout.commissionPercent,
                    commissionAmount: payout.commissionAmount,
                    netAmount: payout.netAmount,
                    paidAt: payout.paidAt || null,
                    transferReference: payout.transferReference || null,
                }
                : null,

            timeline,

            // PaymentEvent.amount minor units (fils) me hai
            events: events.map((e) => ({
                _id: e._id,
                type: e.type,
                outcome: e.outcome,
                amount: e.amount != null ? e.amount / 100 : null,
                currency: e.currency ? String(e.currency).toUpperCase() : null,
                note: e.note || null,
                createdAt: e.createdAt,
            })),

            alert: events.find((e) => payIsAlert(e, order.status))?.outcome || null,
        };

        return res.status(200).json({
            success: true,
            payment
        });

    } catch (err) {
        console.error('getPaymentById error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// ============================================ TRANSACTIONS

const TXN_KINDS = ['payment', 'refund', 'payout'];
const TXN_STATUSES = ['completed', 'pending', 'failed'];
const TXN_EVENT_OUTCOMES = ['paid', 'received', 'refunded_late', 'refunded_duplicate', 'amount_mismatch', 'refunded_admin', 'refund_failed'];

// ---- JS side (detail page) ----
const txnEntriesOf = (e) => {
    if (e.type === 'refund.admin') return ['refund'];
    if (e.outcome === 'paid' || e.outcome === 'received') return ['payment'];
    return ['payment', 'refund'];
};

// 'received' = webhook aaya par processing poori nahi hui -> pending.
// Auto refunds ka final Stripe status store nahi hota -> 'completed' (not synced). Admin refund ka status Order.refund.status se.
const txnEventStatus = (e, kind, order) => {
    if (kind === 'payment') return e.outcome === 'received' ? 'pending' : 'completed';
    if (e.outcome === 'refund_failed') return 'failed';
    if (e.outcome === 'refunded_admin') {
        const s = order?.refund?.status;
        if (s === 'succeeded') return 'completed';
        if (s === 'failed' || s === 'canceled') return 'failed';
        return 'pending';
    }
    return 'completed';
}

const txnMask = (v) => (v ? `••••${String(v).slice(-4)}` : null);

const txnParty = (doc, type) => (doc
    ? { name: payPartyName(doc, type), email: doc.email || null, type }
    : null);

const TXN_STATUS_EXPR = {
    $switch: {
        branches: [
            { case: { $eq: ['$entries', 'payment'] }, then: { $cond: [{ $eq: ['$outcome', 'received'] }, 'pending', 'completed'] } },
            { case: { $eq: ['$outcome', 'refund_failed'] }, then: 'failed' },
            {
                case: { $eq: ['$outcome', 'refunded_admin'] },
                then: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$order.refund.status', 'succeeded'] }, then: 'completed' },
                            { case: { $in: ['$order.refund.status', ['failed', 'canceled']] }, then: 'failed' },
                        ],
                        default: 'pending',
                    },
                },
            },
        ],
        default: 'completed',
    },
};

const txnPipeline = () => [
    { $match: { outcome: { $in: TXN_EVENT_OUTCOMES } } },
    { $lookup: { from: Order.collection.name, localField: 'orderId', foreignField: '_id', as: 'order' } },
    { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
    {
        $addFields: {
            entries: {
                $cond: [
                    { $eq: ['$type', 'refund.admin'] },
                    ['refund'],
                    { $cond: [{ $in: ['$outcome', ['paid', 'received']] }, ['payment'], ['payment', 'refund']] },
                ],
            },
        },
    },
    { $unwind: '$entries' },
    {
        $project: {
            _id: 0,
            key: { $concat: ['e:', { $toString: '$_id' }, ':', '$entries'] },
            kind: '$entries',
            status: TXN_STATUS_EXPR,
            // admin refund fail hua tha, baad me retry se order canceled ho gaya
            resolved: {
                $and: [
                    { $eq: ['$entries', 'refund'] },
                    { $eq: ['$type', 'refund.admin'] },
                    { $eq: ['$outcome', 'refund_failed'] },
                    { $eq: ['$order.status', 'canceled'] },
                ],
            },
            amount: { $divide: [{ $ifNull: ['$amount', 0] }, 100] },
            at: '$createdAt',
            orderRef: '$orderId',
            orderCode: '$order.orderId',
            listingCode: '$order.listingId',
            reference: {
                $cond: [
                    { $and: [{ $eq: ['$entries', 'refund'] }, { $eq: ['$outcome', 'refunded_admin'] }] },
                    { $ifNull: ['$order.refund.stripeRefundId', { $ifNull: ['$paymentIntentId', null] }] },
                    { $ifNull: ['$paymentIntentId', null] },
                ],
            },
            payoutCode: { $literal: null },
        },
    },
    {
        $unionWith: {
            coll: Payout.collection.name,
            pipeline: [
                { $match: { status: { $in: ['requested', 'paid'] } } },
                { $lookup: { from: Order.collection.name, localField: 'orderId', foreignField: '_id', as: 'order' } },
                { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        key: { $concat: ['p:', { $toString: '$_id' }] },
                        kind: { $literal: 'payout' },
                        status: { $cond: [{ $eq: ['$status', 'paid'] }, 'completed', 'pending'] },
                        resolved: { $literal: false },
                        amount: '$netAmount',
                        at: { $ifNull: ['$paidAt', { $ifNull: ['$requestedAt', '$createdAt'] }] },
                        orderRef: '$orderId',
                        orderCode: '$order.orderId',
                        listingCode: '$listingId',
                        reference: { $ifNull: ['$transferReference', null] },
                        payoutCode: '$payoutId',
                    },
                },
            ],
        },
    },
];

export const getAllTransactions = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const { status, kind, sortBy, startDate, endDate } = req.query;
        const search = clean(req.query.search);

        const match = {};
        if (TXN_STATUSES.includes(status)) match.status = status;
        if (TXN_KINDS.includes(kind)) match.kind = kind;

        if (isYMD(startDate) || isYMD(endDate)) {
            match.at = {};
            if (isYMD(startDate)) match.at.$gte = new Date(`${startDate}T00:00:00+04:00`);
            if (isYMD(endDate)) match.at.$lte = new Date(`${endDate}T23:59:59.999+04:00`);
        }

        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            const [vehicleIds, sellerIds, buyerIds] = await Promise.all([
                Vehicle.find({ $or: [{ listingId: rx }, { make: rx }, { model: rx }] }).distinct('_id'),
                Seller.find({ $or: [{ sellerId: rx }, { fullName: rx }, { businessName: rx }, { email: rx }] }).distinct('_id'),
                Buyer.find({ $or: [{ buyerId: rx }, { firstName: rx }, { lastName: rx }, { companyName: rx }, { email: rx }] }).distinct('_id'),
            ]);

            const orderIds = await Order.find({
                $or: [
                    { orderId: rx },
                    { listingId: rx },
                    { vehicleId: { $in: vehicleIds } },
                    { sellerId: { $in: sellerIds } },
                    { buyerId: { $in: [...buyerIds, ...sellerIds] } },
                ],
            }).distinct('_id');

            // reference = Stripe pi_ / re_ id ya bank transfer reference, payoutCode = PAYOUT-xxxxx
            match.$or = [{ orderRef: { $in: orderIds } }, { reference: rx }, { payoutCode: rx }];
        }

        const dir = sortBy === 'oldest' ? 1 : -1;

        const [result] = await PaymentEvent.aggregate([
            ...txnPipeline(),
            {
                $facet: {
                    rows: [
                        { $match: match },
                        { $sort: { at: dir, key: dir } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                    total: [{ $match: match }, { $count: 'n' }],

                    summary: [
                        { $group: { _id: { kind: '$kind', status: '$status', resolved: '$resolved' }, count: { $sum: 1 }, amount: { $sum: '$amount' } } },
                    ],
                    recent: [
                        { $sort: { at: -1, key: -1 } },
                        { $limit: 5 },
                    ],
                },
            },
        ]);

        const total = result.total[0]?.n || 0;

        // buyer, seller, and vehicle details only for the orders on this page
        const orderIds = [...new Set(result.rows.map((r) => r.orderRef).filter(Boolean).map(String))];
        const orders = orderIds.length
            ? await Order.find({ _id: { $in: orderIds } })
                .populate('vehicleId', 'listingId make model year images')
                .populate({ path: 'buyerId', select: 'firstName lastName fullName companyName businessName email' })
                .populate('sellerId', 'fullName businessName email')
                .lean()
            : [];

        const orderMap = new Map(orders.map((o) => [String(o._id), o]));

        const transactions = result.rows.map((r) => {
            const o = orderMap.get(String(r.orderRef));
            const isPayout = r.kind === 'payout';
            return {
                key: r.key,
                kind: r.kind,
                direction: r.kind === 'payment' ? 'in' : 'out',
                status: r.status,
                resolved: !!r.resolved,
                amount: r.amount,
                currency: 'AED',
                at: r.at,
                orderId: r.orderCode || null,
                listingId: r.listingCode || null,
                reference: r.reference || null,
                payoutCode: r.payoutCode || null,
                // payment / refund -> buyer, payout -> seller
                party: isPayout ? txnParty(o?.sellerId, 'Seller') : txnParty(o?.buyerId, o?.buyerType),
                vehicle: o?.vehicleId
                    ? { make: o.vehicleId.make, model: o.vehicleId.model, year: o.vehicleId.year }
                    : null,
            };
        });

        // ---- stats ----
        const stats = {
            total: { count: 0 },
            completed: { count: 0 },
            pending: { count: 0, amount: 0 },
            failed: { count: 0, open: 0 },
            received: { count: 0, amount: 0 },   // payment, completed
            refunded: { count: 0, amount: 0 },   // refund, completed + pending
            paidOut: { count: 0, amount: 0 },    // payout, completed
        };
        const kinds = {};
        TXN_KINDS.forEach((k) => { kinds[k] = { count: 0, amount: 0 }; });

        for (const s of result.summary) {

            const { kind: k, status: st, resolved } = s._id;
            stats.total.count += s.count;

            if (st === 'failed') {
                stats.failed.count += s.count;
                if (!resolved) stats.failed.open += s.count;
                continue;   // failed rows me paisa hila hi nahi
            }

            if (st === 'completed') stats.completed.count += s.count;
            if (st === 'pending') {
                stats.pending.count += s.count;
                stats.pending.amount += s.amount;
            }

            if (kinds[k]) {
                kinds[k].count += s.count;
                kinds[k].amount += s.amount;
            }

            if (k === 'payment' && st === 'completed') {
                stats.received.count += s.count;
                stats.received.amount += s.amount;
            }
            if (k === 'refund') {
                stats.refunded.count += s.count;
                stats.refunded.amount += s.amount;
            }
            if (k === 'payout' && st === 'completed') {
                stats.paidOut.count += s.count;
                stats.paidOut.amount += s.amount;
            }
        }

        const recent = result.recent.map((r) => ({
            key: r.key,
            kind: r.kind,
            status: r.status,
            amount: r.amount,
            at: r.at,
            ref: r.payoutCode || r.orderCode || null,
        }));

        return res.status(200).json({
            success: true,
            message: "Transaction data fetched",
            transactions,
            stats,
            kinds,
            recent,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.log("getAllTransactions Error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

const txnLoadOrder = (orderId) => (orderId
    ? Order.findById(orderId)
        .populate('vehicleId', 'listingId make model year images trim mileage fuelType transmission bodyType exteriorColor interiorColor vin condition')
        .populate('sellerId', 'sellerId fullName businessName email phone profileImage')
        .populate({
            path: 'buyerId',
            select: 'buyerId sellerId firstName lastName fullName companyName businessName email mobile phone profileImageUrl profileImage',
        })
        .populate('refund.refundedBy', 'name')
        .lean()
    : Promise.resolve(null));

// get transaction detail
export const getTransactionById = async (req, res) => {
    try {
        const parts = String(req.params.key || '').split(':');
        const isEvent = parts.length === 3 && parts[0] === 'e' && ['payment', 'refund'].includes(parts[2]);
        const isPayout = parts.length === 2 && parts[0] === 'p';

        if ((!isEvent && !isPayout) || !mongoose.isValidObjectId(parts[1])) return bad(res, 'Invalid transaction id');

        let kind;
        let event = null;
        let payout = null;
        let order = null;

        if (isEvent) {
            kind = parts[2];
            event = await PaymentEvent.findOne({ _id: parts[1], outcome: { $in: TXN_EVENT_OUTCOMES } }).lean();
            if (!event || !txnEntriesOf(event).includes(kind)) return bad(res, 'Transaction not found', 404);
            order = await txnLoadOrder(event.orderId);
        } else {
            kind = 'payout';
            payout = await Payout.findOne({ _id: parts[1], status: { $in: ['requested', 'paid'] } })
                .populate('paidBy', 'name')
                .lean();
            if (!payout) return bad(res, 'Transaction not found', 404);
            order = await txnLoadOrder(payout.orderId);
        }

        const b = order?.buyerId;
        const isSellerBuyer = order?.buyerType === 'Seller';
        const s = order?.sellerId;
        const listingId = order?.listingId || payout?.listingId || null;

        // ---- status / amount / date ----
        const status = isEvent ? txnEventStatus(event, kind, order) : (payout.status === 'paid' ? 'completed' : 'pending');
        const failed = isEvent && kind === 'refund' && event.outcome === 'refund_failed';
        const resolved = failed && event.type === 'refund.admin' && order?.status === 'canceled';

        const amount = isEvent ? (event.amount != null ? event.amount / 100 : null) : payout.netAmount;
        const at = isEvent ? event.createdAt : (payout.paidAt || payout.requestedAt || payout.createdAt);

        const reference = isEvent
            ? (kind === 'refund' && event.outcome === 'refunded_admin'
                ? (order?.refund?.stripeRefundId || event.paymentIntentId || null)
                : (event.paymentIntentId || null))
            : (payout.transferReference || null);

        // ---- timeline ----
        let timeline;
        if (isEvent) {
            const events = order
                ? await PaymentEvent.find({ orderId: order._id, outcome: { $in: TXN_EVENT_OUTCOMES } }).sort({ createdAt: 1 }).lean()
                : [event];

            timeline = [
                ...(order?.statusHistory || []).map((h) => ({ source: 'order', status: h.status, at: h.at, by: h.by, note: h.note || null })),
                ...events.map((e) => ({ source: 'gateway', status: e.outcome, at: e.createdAt, by: 'gateway', note: e.note || null })),
            ];
        } else {
            timeline = (payout.history || []).map((h) => ({ source: 'payout', status: h.status, at: h.at, by: h.by, note: h.note || null }));
        }
        timeline.sort((x, y) => new Date(x.at) - new Date(y.at));

        const saleLabel = order?.source === 'auction' ? 'Auction' : order?.source === 'buy_now' ? 'Buy Now' : null;
        const description = kind === 'payment'
            ? `Payment received for ${listingId || 'order'}${saleLabel ? ` (${saleLabel})` : ''}`
            : kind === 'refund'
                ? `Refund to buyer for ${listingId || 'order'}`
                : `Seller payout for ${listingId || 'order'}`;

        const txn = {
            key: req.params.key,
            kind,
            direction: kind === 'payment' ? 'in' : 'out',
            status,
            resolved,
            amount,
            currency: isEvent && event.currency ? String(event.currency).toUpperCase() : 'AED',
            at,
            reference,
            description,
            note: isEvent && !failed ? (event.note || null) : null,
            failureNote: failed ? (event.note || null) : null,
            gateway: isEvent
                ? {
                    outcome: event.outcome,
                    eventId: event.eventId || null,
                    sessionId: event.sessionId || null,
                    paymentIntentId: event.paymentIntentId || null,
                    stripeRefundId: kind === 'refund' && event.outcome === 'refunded_admin' ? (order?.refund?.stripeRefundId || null) : null,
                    refundedByName: kind === 'refund' && event.outcome === 'refunded_admin' ? (order?.refund?.refundedBy?.name || null) : null,
                }
                : null,

            // refund row ka detail page isi id se khulta hai
            refundId: isEvent && kind === 'refund' ? String(event._id) : null,

            payout: isPayout
                ? {
                    _id: payout._id,
                    payoutId: payout.payoutId,
                    status: payout.status,
                    grossAmount: payout.grossAmount,
                    commissionPercent: payout.commissionPercent,
                    commissionAmount: payout.commissionAmount,
                    netAmount: payout.netAmount,
                    requestedAt: payout.requestedAt || null,
                    paidAt: payout.paidAt || null,
                    paidByName: payout.paidBy?.name || null,
                    transferReference: payout.transferReference || null,
                    bank: payout.bankSnapshot?.bankName || payout.bankSnapshot?.accountHolderName
                        ? {
                            accountHolderName: payout.bankSnapshot.accountHolderName || null,
                            bankName: payout.bankSnapshot.bankName || null,
                            iban: txnMask(payout.bankSnapshot.ibanNumber),
                            accountNumber: txnMask(payout.bankSnapshot.accountNumber),
                            swiftCode: payout.bankSnapshot.swiftCode || null,
                        }
                        : null,
                }
                : null,

            order: order
                ? {
                    _id: order._id,
                    orderId: order.orderId,
                    listingId: order.listingId,
                    source: order.source,
                    status: order.status,
                    amount: order.amount,
                    paidAt: order.paidAt || null,
                }
                : null,

            vehicle: order?.vehicleId
                ? {
                    listingId: order.vehicleId.listingId,
                    make: order.vehicleId.make,
                    model: order.vehicleId.model,
                    year: order.vehicleId.year,
                    image: payFirstImage(order.vehicleId.images),

                    trim: order.vehicleId.trim || null,
                    mileage: order.vehicleId.mileage ?? null,
                    fuelType: order.vehicleId.fuelType || null,
                    transmission: order.vehicleId.transmission || null,
                    bodyType: order.vehicleId.bodyType || null,
                    exteriorColor: order.vehicleId.exteriorColor || null,
                    interiorColor: order.vehicleId.interiorColor || null,
                    vin: order.vehicleId.vin || null,
                    condition: order.vehicleId.condition || null,
                }
                : null,

            buyer: b
                ? {
                    type: order.buyerType,
                    readableId: isSellerBuyer ? b.sellerId : b.buyerId,
                    name: payPartyName(b, order.buyerType),
                    email: b.email || null,
                    phone: (isSellerBuyer ? b.phone : b.mobile) || null,
                    image: (isSellerBuyer ? b.profileImage : b.profileImageUrl) || null,
                }
                : null,

            seller: s
                ? {
                    readableId: s.sellerId,
                    name: payPartyName(s, 'Seller'),
                    email: s.email || null,
                    phone: s.phone || null,
                    image: s.profileImage || null,
                }
                : null,

            timeline,
        };

        return res.status(200).json({
            success: true,
            message: "Fetched transaction details",
            transaction: txn
        });

    } catch (err) {
        console.log("getTransactionById Error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// ============================================ ADMIN DASHBOARD

const UAE_OFFSET_MS = 4 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Returns Monday 00:00 UAE time as a UTC Date.
const getUaeWeekStart = (date) => {
    const uaeDate = new Date(date.getTime() + UAE_OFFSET_MS);
    const day = uaeDate.getUTCDay();
    uaeDate.setUTCDate(uaeDate.getUTCDate() - ((day + 6) % 7));
    uaeDate.setUTCHours(0, 0, 0, 0);
    return new Date(uaeDate.getTime() - UAE_OFFSET_MS);
};

const getRange = (range, now) => {
    const thisWeekStart = getUaeWeekStart(now);
    const offset = range === 'last_week' ? 1 : range === 'two_weeks_ago' ? 2 : 0;
    const start = new Date(thisWeekStart.getTime() - offset * 7 * DAY_MS);
    const end = new Date(start.getTime() + 7 * DAY_MS);
    return { start, end };
};

const getPreviousWeek = (start) => ({
    start: new Date(start.getTime() - 7 * DAY_MS),
    end: start,
});

const percentChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - previous) / previous) * 1000) / 10;
};

const dateKeyUae = (date) => {
    const uae = new Date(date.getTime() + UAE_OFFSET_MS);
    return `${uae.getUTCFullYear()}-${String(uae.getUTCMonth() + 1).padStart(2, '0')}-${String(uae.getUTCDate()).padStart(2, '0')}`;
};

const formatDay = (date) => new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai', day: 'numeric', month: 'short',
}).format(date);

export const adminDashboardStats = async (req, res) => {
    try {
        const allowedRanges = ['this_week', 'last_week', 'two_weeks_ago'];
        const rangeKey = allowedRanges.includes(req.query.range) ? req.query.range : 'this_week';
        const now = new Date();
        const range = getRange(rangeKey, now);
        const previousRange = getPreviousWeek(range.start);

        const [buyers, sellers, totalAuctions, activeBids, paidRevenue, thisWeekOrders, previousWeekOrders, vehicleTypes, recentNotifications] = await Promise.all([
            Buyer.countDocuments(),
            Seller.countDocuments(),
            Vehicle.countDocuments({ adminStatus: 'approved' }),

            Bid.countDocuments({ status: 'active' }),
            Order.aggregate([
                { $match: { status: 'paid' } },
                { $group: { _id: null, amount: { $sum: '$amount' } } },
            ]),

            Order.aggregate([
                { $match: { status: 'paid', paidAt: { $gte: range.start, $lt: range.end } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt', timezone: '+04:00' } }, amount: { $sum: '$amount' }, count: { $sum: 1 } } },
            ]),

            Order.aggregate([
                { $match: { status: 'paid', paidAt: { $gte: previousRange.start, $lt: previousRange.end } } },
                { $group: { _id: null, amount: { $sum: '$amount' }, count: { $sum: 1 } } },
            ]),

            Vehicle.aggregate([
                { $match: { adminStatus: 'approved' } },
                { $group: { _id: '$vehicleType', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),

            Notification.find({ recipientType: 'Admin' })
                .sort({ createdAt: -1 }).limit(5)
                .select('type title message createdAt vehicleId').lean(),
        ]);

        const totalUsers = buyers + sellers;
        const revenue = paidRevenue[0]?.amount || 0;
        const currentWeekRevenue = thisWeekOrders.reduce((sum, day) => sum + day.amount, 0);
        const previousWeekRevenue = previousWeekOrders[0]?.amount || 0;
        const currentSalesCount = thisWeekOrders.reduce((sum, day) => sum + day.count, 0);
        const previousSalesCount = previousWeekOrders[0]?.count || 0;

        const chartValues = new Map(thisWeekOrders.map((item) => [item._id, item.amount]));
        const salesOverview = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(range.start.getTime() + index * DAY_MS);
            return {
                date: dateKeyUae(date),
                name: formatDay(date),
                value: chartValues.get(dateKeyUae(date)) || 0,
            };
        });

        const totalCategoryVehicles = vehicleTypes.reduce((sum, item) => sum + item.count, 0);
        const categories = vehicleTypes.slice(0, 4).map((item) => ({
            name: item._id || 'Other',
            count: item.count,
            percentage: totalCategoryVehicles ? Math.round((item.count / totalCategoryVehicles) * 100) : 0,
        }));

        return res.status(200).json({
            success: true,
            data: {
                range: rangeKey,
                summary: {
                    totalUsers,
                    totalAuctions,
                    revenue,
                    activeBids,
                    trends: {
                        usersPercent: null,
                        auctionsPercent: null,
                        revenuePercent: percentChange(currentWeekRevenue, previousWeekRevenue),
                        salesPercent: percentChange(currentSalesCount, previousSalesCount),
                    },
                },
                salesOverview,
                recentActivities: recentNotifications.map((item) => ({
                    id: String(item._id),
                    type: item.type,
                    title: item.title,
                    message: item.message,
                    createdAt: item.createdAt,
                    vehicleId: item.vehicleId || null,
                })),
                categories,
            },
        });

    } catch (err) {
        console.log("adminDashboardStats Error : ", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// ============================================ REPORT & ANALYTICS

const PAID_ORDER_STATUSES = ['paid'];

const getWeekStartUae = (date) => {
    const shifted = new Date(date.getTime() + UAE_OFFSET_MS);
    const daysSinceMonday = (shifted.getUTCDay() + 6) % 7;
    shifted.setUTCDate(shifted.getUTCDate() - daysSinceMonday);
    shifted.setUTCHours(0, 0, 0, 0);
    return new Date(shifted.getTime() - UAE_OFFSET_MS);
};

const getRangeReport = (rangeKey, now) => {
    const offset = rangeKey === 'last_week' ? 1 : rangeKey === 'two_weeks_ago' ? 2 : 0;
    const start = new Date(getWeekStartUae(now).getTime() - offset * 7 * DAY_MS);
    return { start, end: new Date(start.getTime() + 7 * DAY_MS) };
};

const toUaeDateKey = (date) => {
    const shifted = new Date(date.getTime() + UAE_OFFSET_MS);
    return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}-${String(shifted.getUTCDate()).padStart(2, '0')}`;
};

const getPercent = (part, whole) => whole ? Math.round((part / whole) * 1000) / 10 : 0;
const getInitials = (name = '') => name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const getRangeMatch = (field, range) => ({ [field]: { $gte: range.start, $lt: range.end } });

export const getReportAnalytics = async (req, res) => {
    try {
        const validRanges = ['this_week', 'last_week', 'two_weeks_ago'];
        const rangeKey = validRanges.includes(req.query.range) ? req.query.range : 'this_week';
        const range = getRangeReport(rangeKey, new Date());
        const paidRange = { status: { $in: PAID_ORDER_STATUSES }, ...getRangeMatch('paidAt', range) };
        const createdOrderRange = getRangeMatch('createdAt', range);

        const [
            activeBuyers, activeSellers, totalBuyers, totalSellers,
            closedAuctions, soldOrders, platformCommission,
            averageBid, revenueByDay, bidsByDay, usersByDay,
            vehicleApproval, vehicleCategories, recentPaidPurchases,
            transactionEvents, recentPayouts, topPurchasers,
            topSellerSales, peakBidHour, averageAuctionDuration,
            periodOrderCounts, distinctSuccessfulBuyers, distinctBidders,
        ] = await Promise.all([
            Buyer.countDocuments({ accountStatus: { $ne: 'suspended' } }),
            Seller.countDocuments({ isComplete: true, accountStatus: { $ne: "suspended" },}),
            Buyer.countDocuments(),
            Seller.countDocuments({ isComplete: true }),
            Vehicle.countDocuments({
                auctionEndDateTime: { $gte: range.start, $lt: range.end },
                auctionStatus: { $in: ['sold', 'unsold', 'reserve-not-met', 'canceled'] },
            }),
            
            Order.countDocuments(paidRange),

            Payout.aggregate([
                { $match: { status: { $ne: 'canceled' }} },
                { $group: { _id: null, amount: { $sum: '$commissionAmount' } } },
            ]),

            Bid.aggregate([
                { $group: { _id: null, average: { $avg: '$amount' } } },
            ]),

            Order.aggregate([
                { $match: paidRange },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt', timezone: 'Asia/Dubai' } },
                        revenue: { $sum: '$amount' },
                    }
                },
            ]),

            Bid.aggregate([
                { $match: getRangeMatch('createdAt', range) },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Dubai' } },
                        bids: { $sum: 1 },
                    }
                },
            ]),

            Promise.all([
                Buyer.aggregate([
                    { $match: getRangeMatch('createdAt', range) },
                    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Dubai' } }, users: { $sum: 1 } } },
                ]),
                Seller.aggregate([
                    { $match: getRangeMatch('createdAt', range) },
                    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Dubai' } }, users: { $sum: 1 } } },
                ]),
            ]),

            Promise.all([
                Vehicle.countDocuments({ adminStatus: 'approved' }),
                Vehicle.countDocuments({ adminStatus: 'pending' }),
                Vehicle.countDocuments({ adminStatus: 'rejected' }),
            ]),
            Vehicle.aggregate([
                { $match: { adminStatus: 'approved' } },
                { $group: { _id: '$vehicleType', value: { $sum: 1 } } },
                { $sort: { value: -1 } },
            ]),

            Order.find({ status: "paid" })
                .sort({ amount: -1 }).limit(5)
                .populate('vehicleId', 'make model year images listingId')
                .select('orderId listingId amount currency paidAt vehicleId')
                .lean(),
            PaymentEvent.find({}).sort({ createdAt: -1 }).limit(8)
                .select('eventId type amount currency outcome createdAt')
                .lean(),
            Payout.find({ status: { $in: ['requested', 'paid'] } })
                .sort({ createdAt: -1 }).limit(8)
                .select('payoutId status netAmount currency transferReference createdAt')
                .lean(),

            Order.aggregate([
                { $match: { status: 'paid', ...getRangeMatch('paidAt', range) } },
                {
                    $group: {
                        _id: { buyerId: '$buyerId', buyerType: '$buyerType' },
                        spent: { $sum: '$amount' },
                    }
                },
                { $sort: { spent: -1 } }, { $limit: 5 },
            ]),
            Order.aggregate([
                { $match: { status: 'paid', ...getRangeMatch('paidAt', range) } },
                {
                    $group: {
                        _id: '$sellerId',
                        sales: { $sum: '$amount' },
                        auctions: { $sum: { $cond: [{ $eq: ['$source', 'auction'] }, 1, 0] } },
                    }
                },
                { $sort: { sales: -1 } }, { $limit: 5 },
            ]),

            Bid.aggregate([
                { $match: getRangeMatch('createdAt', range) },
                { $group: { _id: { $hour: { date: '$createdAt', timezone: 'Asia/Dubai' } }, bids: { $sum: 1 } } },
                { $sort: { bids: -1 } }, { $limit: 1 },
            ]),

            Vehicle.aggregate([
                { $match: { auctionStartDateTime: { $exists: true }, auctionEndDateTime: { $exists: true }, auctionEndDateTime: { $gte: range.start, $lt: range.end } } },
                { $group: { _id: null, averageMs: { $avg: { $subtract: ['$auctionEndDateTime', '$auctionStartDateTime'] } } } },
            ]),
            Order.aggregate([
                { $match: createdOrderRange },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Order.distinct('buyerId', paidRange),
            Bid.distinct('bidderId', getRangeMatch('createdAt', range)),
        ]);

        const mapByDate = (rows) => new Map(rows.map((row) => [row._id, row]));
        const revenueMap = mapByDate(revenueByDay);
        const bidMap = mapByDate(bidsByDay);
        const buyerGrowthMap = mapByDate(usersByDay[0]);
        const sellerGrowthMap = mapByDate(usersByDay[1]);
        const revenueChart = [];
        const bidChart = [];
        const userGrowthChart = [];

        for (let i = 0; i < 7; i += 1) {
            const date = new Date(range.start.getTime() + i * DAY_MS);
            const key = toUaeDateKey(date);
            revenueChart.push({ date: key, name: formatDay(date), revenue: revenueMap.get(key)?.revenue || 0 });
            bidChart.push({ date: key, dateLabel: formatDay(date), bids: bidMap.get(key)?.bids || 0 });
            userGrowthChart.push({ date: key, dateLabel: formatDay(date), users: (buyerGrowthMap.get(key)?.users || 0) + (sellerGrowthMap.get(key)?.users || 0) });
        }

        const topBuyerIds = topPurchasers.map((item) => item._id.buyerId);
        const buyerDocs = await Buyer.find({ _id: { $in: topBuyerIds } }).select('firstName lastName companyName').lean();
        const sellerBuyerDocs = await Seller.find({ _id: { $in: topBuyerIds } }).select('fullName businessName').lean();
        const purchaserNames = new Map([
            ...buyerDocs.map((item) => [String(item._id), item.companyName || `${item.firstName || ''} ${item.lastName || ''}`.trim()]),
            ...sellerBuyerDocs.map((item) => [String(item._id), item.businessName || item.fullName]),
        ]);

        const topSellerIds = topSellerSales.map((item) => item._id);
        const sellerDocs = await Seller.find({ _id: { $in: topSellerIds } }).select('fullName businessName').lean();
        const sellerNames = new Map(sellerDocs.map((item) => [String(item._id), item.businessName || item.fullName]));

        const successfulCount = periodOrderCounts.find((item) => item._id === 'paid')?.count || 0;
        const attemptsCount = periodOrderCounts.reduce((sum, item) => sum + item.count, 0);

        const peakHour = peakBidHour[0]?._id;
        const formatHour = (hour) => {
            if (hour === undefined) return 'Not enough data';
            const start = `${String(hour % 12 || 12).padStart(2, '0')}:00 ${hour < 12 ? 'AM' : 'PM'}`;
            const endHour = (hour + 1) % 24;
            const end = `${String(endHour % 12 || 12).padStart(2, '0')}:00 ${endHour < 12 ? 'AM' : 'PM'}`;
            return `${start} - ${end}`;
        };
        const averageDurationHours = averageAuctionDuration[0]?.averageMs
            ? Math.round(averageAuctionDuration[0].averageMs / (60 * 60 * 1000) * 10) / 10
            : null;

        const transactionRows = [
            ...transactionEvents.map((event) => ({
                id: event.eventId || String(event._id),
                type: /refund/i.test(event.type) || String(event.outcome).startsWith('refunded') ? 'Refund' : 'Payment',
                amount: typeof event.amount === 'number' ? event.amount / 100 : 0,
                status: event.outcome === 'paid' || event.outcome === 'refunded_admin' || String(event.outcome).startsWith('refunded') ? 'Completed' : event.outcome,
                createdAt: event.createdAt,
            })),

            ...recentPayouts.map((payout) => ({
                id: payout.payoutId || String(payout._id),
                type: 'Payout',
                amount: payout.netAmount || 0,
                status: payout.status === 'paid' ? 'Completed' : 'Pending',
                createdAt: payout.createdAt,
            })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        const totalApprovedVehicles = vehicleCategories.reduce((sum, item) => sum + item.value, 0);
        const categoryColors = ['#2563EB', '#10B981', '#F59E0B', '#6D28D9', '#94A3B8'];
        const categorySegments = vehicleCategories.slice(0, 5).map((item, index) => ({
            name: item._id || 'Other', value: item.value, color: categoryColors[index % categoryColors.length],
        }));

        const buyerBidCounts = await Promise.all(topPurchasers.map(async (item) => {
            const bidType = item._id.buyerType;
            const count = await Bid.countDocuments({ bidderId: item._id.buyerId, bidderType: bidType, ...getRangeMatch('createdAt', range) });
            return [String(item._id.buyerId), count];
        }));
        const buyerBidCountMap = new Map(buyerBidCounts);

        return res.status(200).json({
            success: true,
            data: {
                range: rangeKey,
                summary: {
                    auctionSuccessRate: `${getPercent(soldOrders, closedAuctions)}%`,
                    platformProfit: platformCommission[0]?.amount || 0,
                    activeUsers: activeBuyers + activeSellers,
                    totalUsers: totalBuyers + totalSellers,
                    averageBidValue: Math.round(averageBid[0]?.average || 0),
                },
                revenueOverview: revenueChart,
                vehicleCategories: categorySegments,
                userGrowth: userGrowthChart,
                approvalSummary: {
                    approved: vehicleApproval[0], pending: vehicleApproval[1], rejected: vehicleApproval[2],
                    total: vehicleApproval.reduce((sum, count) => sum + count, 0),
                },
                bidActivity: bidChart.map(({ dateLabel, bids }) => ({ date: dateLabel, bids })),

                paymentProviders: [{ name: 'Stripe', value: 1, color: '#2563EB' }],
                topBuyers: topPurchasers.map((item, index) => {
                    const name = purchaserNames.get(String(item._id.buyerId)) || 'User';
                    return { rank: index + 1, name, initials: getInitials(name), spent: item.spent, bids: buyerBidCountMap.get(String(item._id.buyerId)) || 0 };
                }),
                topSellers: topSellerSales.map((item, index) => {
                    const name = sellerNames.get(String(item._id)) || 'Seller';
                    return { rank: index + 1, name, initials: getInitials(name), sales: item.sales, auctions: item.auctions };
                }),
                highestSellingVehicles: recentPaidPurchases.map((order) => ({
                    id: String(order._id),
                    name: order.vehicleId ? `${order.vehicleId.make} ${order.vehicleId.model} ${order.vehicleId.year}` : order.listingId,
                    image: order.vehicleId?.images?.[0]?.url || '',
                    price: order.amount,
                    date: order.paidAt,
                })),
                recentTransactions: transactionRows,
                insights: {
                    revenueForecast: null,
                    bestCategory: vehicleCategories[0]?._id || 'Not enough data',
                    peakBiddingHours: formatHour(peakHour),
                    averageAuctionDurationHours: averageDurationHours,
                    conversionRate: getPercent(successfulCount, attemptsCount),
                    buyerSuccessRate: getPercent(distinctSuccessfulBuyers.length, distinctBidders.length),
                    approvedVehicleCount: totalApprovedVehicles,
                },
            },
        });

    } catch (err) {
        console.error('getReportAnalytics error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch report analytics'
        });
    }
};