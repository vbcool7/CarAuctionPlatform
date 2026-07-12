
import jwt from 'jsonwebtoken';

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Access Denied: ${decoded.role} not allowed here`
                });
            }

            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
    };
};

export default authMiddleware;