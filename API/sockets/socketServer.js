
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

import Admin from '../models/adminModelSchema.js';

let io;

export const initSocket = (httpServer, allowedOrigins) => {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    // auth middleware — mirrors authMiddleware.js REST pattern
    io.use((socket, next) => {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Unauthorized'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            socket.user = decoded;
            next();
        } catch (err) {
            return next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const { id, role } = socket.user;

        socket.join(`user:${id}`);
        socket.join(`role:${role}`);

        console.log(`[socket] connected: user:${id} (${role})`);

        // ---- NEW: vehicle-room-for-bidding ----
        socket.on('joinVehicleRoom', (vehicleId) => {
            socket.join(`vehicle:${vehicleId}`);
        });

        socket.on('leaveVehicleRoom', (vehicleId) => {
            socket.leave(`vehicle:${vehicleId}`);
        });
        // ---- NEW-END ----

        socket.on('disconnect', () => {
            console.log(`[socket] disconnected: user:${id}`);
        });

        // ---- NEW: live chat staff room ----
        if (role === 'admin' || role === 'auctionManager') {
            (async () => {
                try {
                    const staff = await Admin.findById(id).select('name role permissions isActive').lean();
                    const allowed = staff?.isActive && (staff.role === 'admin' || staff.permissions?.manageLiveChat);
                    if (!allowed) return;

                    socket.join('staff:livechat');

                    const firstName = String(staff.name || '').trim().split(/\s+/)[0] || 'Support';
                    socket.on('chat:typing', ({ conversationId, typing }) => {
                        socket.to('staff:livechat').emit('chat:typing', {
                            conversationId, typing: !!typing, staffId: id, name: firstName,
                        });
                    });
                } catch (err) {
                    console.error('[socket] live chat staff join failed:', err.message);
                }
            })();
        }
        // ---- NEW-END ----

        // ---- NEW: dispute chat staff room ----
        if (role === 'admin' || role === 'auctionManager') {
            (async () => {
                try {
                    const staff = await Admin.findById(id).select('role permissions isActive').lean();
                    const allowed = staff?.isActive !== false && (staff?.role === 'admin' || staff?.permissions?.managePayments);
                    if (allowed) socket.join('staff:disputes');
                } catch (err) {
                    console.error('[socket] dispute staff join failed:', err.message);
                }
            })();
        }
        // ---- NEW-END ----
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized — call initSocket() first');
    }
    return io;
};