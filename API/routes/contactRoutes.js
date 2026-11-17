
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    createContact
} from '../controllers/contactController.js';

const router = express.Router();

router.post('/create-contact', createContact);

export default router;