
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

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

        socket.on('disconnect', () => {
            console.log(`[socket] disconnected: user:${id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized — call initSocket() first');
    }
    return io;
};