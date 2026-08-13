
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/imageStorage.js';
import { decodeVin, addVehicle } from '../controllers/vehicleController.js';

const router = express.Router();

router.get('/decode-vin/:vin', decodeVin);
router.post('/add-vehicle',
    authMiddleware(['seller']),
    upload.fields([
        { name: 'images', maxCount: 15 },
        { name: 'documents', maxCount: 5 },
    ]),
    addVehicle);

export default router;