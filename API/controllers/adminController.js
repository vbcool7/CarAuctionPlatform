
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { deleteCloudinaryFiles } from '../utils/cloudinaryUtils.js';

import Admin from '../models/adminModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';
import Seller from '../models/sellerModelSchema.js';

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
            firstName, lastName, email, mobile, password, confirmPassword, gender,
            dob, nationality, country, city, address, pincode, buyerType, companyName, registrationNumber, vatNumber,
            paymentMethod, isEmailVerified, isMobileVerified, identityDocType, addressDocType,
            kycStatus, accountStatus
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
            { value: password, label: "Password" },
            { value: dob, label: "Date Of Birth" },
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

        if (password !== confirmPassword) {
            if (req.files) await deleteCloudinaryFiles(req.files);
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
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

        const hashedPassword = await bcrypt.hash(password, 10);
        const resolvedKycStatus = kycStatus || 'pending';

        const newBuyer = new Buyer({
            firstName, lastName, email, mobile, password: hashedPassword, gender, profileImageUrl,

            identityVerification: { documentType: identityDocType, frontImageUrl, backImageUrl, selfieImageUrl, status: resolvedKycStatus },
            addressVerification: { documentType: addressDocType, documentUrl, landlordIdUrl, status: resolvedKycStatus },

            dob, nationality, country, city, address, pincode, buyerType, companyName, registrationNumber, vatNumber,

            isEmailVerified: isEmailVerified === 'true',
            isMobileVerified: isMobileVerified === 'true',

            payment: {
                method: paymentMethod
            },

            status: accountStatus || 'pending',
            createdBy: 'admin',
            addedByAdminId: req.user.id
        });

        await newBuyer.save();

        const buyerToReturn = newBuyer.toObject();
        delete buyerToReturn.password;

        return res.status(201).json({
            success: true,
            message: "Buyer added successfully",
            data: buyerToReturn
        });

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

// add new seller
export const addNewSeller = async (req, res) => {
    try {
        const {
            // Personal Info
            fullName,
            email,
            mobile,
            password,
            confirmPassword,

            dob,
            gender,
            nationality,

            // Business Info
            companyName,
            businessType,
            sellerType,
            tradeLicense,
            tradeLicenseExpireDate,
            vatNumber,
            website,
            businessAddress,

            // Additional Info
            prefferedLanguage,
            supportMail,
            supportMobile,

            // Admin
            accountStatus,
        } = req.body;

        const profilePhotoPath = req.file ? req.file.path : "";

        if (password !== confirmPassword) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        const existingBuyer = await Buyer.findOne({ $or: [{ email }, { mobile }] });
        if (existingBuyer) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(409).json({
                success: false,
                message: "A buyer with this email or mobile already exists"
            });
        }

        if (!buyerType) {
            if (req.file) await deleteCloudinaryFiles(req.file);
            return res.status(400).json({
                success: false,
                message: "Buyer Type is required"
            });
        }

    } catch (err) {
        if (req.file) return deleteCloudinaryFiles(req.file);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};