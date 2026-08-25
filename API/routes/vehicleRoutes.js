
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/imageStorage.js';
import { decodeVin, addVehicle, getMyVehicles, getVehicleStats, getVehicleById } from '../controllers/vehicleController.js';

const router = express.Router();

router.get('/decode-vin/:vin', decodeVin);
router.post('/add-vehicle',
    authMiddleware(['seller']),
    upload.fields([
        { name: 'images', maxCount: 15 },
        { name: 'documents', maxCount: 5 },
    ]),
    addVehicle);

router.get('/get-my-vehicles', authMiddleware(['seller']), getMyVehicles);
router.get('/get-vehicle-stats', authMiddleware(['seller']), getVehicleStats);
router.get('/get-vehicle-detail/:id', authMiddleware(['seller']), getVehicleById);

export default router;