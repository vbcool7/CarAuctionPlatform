
import { getIO } from "./socketServer.js";

export const emitToUser = (userId, event, payload) => {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, payload);
};

export const emitToRole = (role, event, payload) => {
    const io = getIO();
    io.to(`role:${role}`).emit(event, payload);
};