
import jwt from 'jsonwebtoken';
import Seller from '../models/sellerModelSchema.js';

const authMiddleware = (roles = []) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        let decoded;
        try {
            decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({
                success: false,
                message: `Access Denied: ${decoded.role} not allowed here`
            });
        }

        if (decoded.role === "seller") {
            try {
                const seller = await Seller.findById(decoded.id).select("accountStatus passwordChangedAt");
                if (!seller) {
                    return res.status(401).json({ success: false, message: "Account not found" });
                }
                if (seller.accountStatus === "suspended") {
                    return res.status(403).json({
                        success: false,
                        code: "ACCOUNT_SUSPENDED",
                        message: "Account suspended"
                    });
                }
                if (seller.passwordChangedAt &&
                    decoded.iat < Math.floor(seller.passwordChangedAt.getTime() / 1000)) {
                    return res.status(401).json({ success: false, message: "Session expired, please login again" });
                }
            } catch (err) {
                console.error("authMiddleware DB error:", err);
                return res.status(500).json({ success: false, message: "Server error" });
            }
        }

        req.user = decoded;
        next();
    };
};

export default authMiddleware;