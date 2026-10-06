
// find identity - seller can't see bid place btn on their own vehicle

import jwt from 'jsonwebtoken';

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        try {
            req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET_KEY);
        } catch (e) {
            // guest only
        }
    }
    next();
};