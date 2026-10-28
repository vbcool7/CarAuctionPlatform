
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/imageStorage.js';
import { createSupportTicket, getMySupportTickets } from '../controllers/supportTicketController.js';

const router = express.Router();

router.post('/create-ticket', authMiddleware(['buyer', 'seller']), upload.single('attachment'), createSupportTicket);
router.get('/my-tickets', authMiddleware(['buyer', 'seller']), getMySupportTickets);

export default router;