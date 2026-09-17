
import Admin from '../models/adminModelSchema.js';

const requirePermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (req.user.role === 'admin') return next(); // admin full access

            if (req.user.role !== 'auctionManager') {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied"
                });
            }

            // live permission check from DB
            const freshUser = await Admin.findById(req.user.id).select('permissions isActive');

            if (!freshUser) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: account not found"
                });
            }

            if (!freshUser.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: your account has been deactivated"
                });
            }

            if (!freshUser?.permissions?.[permission]) {
                return res.status(403).json({
                    success: false,
                    message: `Access Denied: missing '${permission}' permission`
                });
            }

            next();
        } catch (err) {
            console.error("Permission Check Error:", err);
            return res.status(500).json({
                success: false,
                message: "Server Error Occurred"
            });
        }
    };
};

export default requirePermission;