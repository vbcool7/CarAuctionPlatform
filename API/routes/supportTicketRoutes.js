
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/imageStorage.js';
import { createSupportTicket, getMySupportTickets } from '../controllers/supportTicketController.js';
import { createSupportCallRequest, getMyCallRequests } from '../controllers/supportCallRequestController.js';

const router = express.Router();

// ========================== Ticket Reltaed - BUYER + SELLER
router.post('/create-ticket', authMiddleware(['buyer', 'seller']), upload.single('attachment'), createSupportTicket);
router.get('/my-tickets', authMiddleware(['buyer', 'seller']), getMySupportTickets);

// ========================== Call Request
router.post("/request-call", authMiddleware(['buyer', 'seller']), createSupportCallRequest);
router.get("/my-call-requests", authMiddleware(['buyer', 'seller']), getMyCallRequests);

export default router;