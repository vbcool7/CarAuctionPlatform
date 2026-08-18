
import express from 'express';
import { upload } from '../middlewares/imageStorage.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminSignup, adminLogin, adminGet, adminLogout, addNewBuyer, addNewSeller, getAllSellers, toggleSellerVerification } from '../controllers/adminController.js';

const router = express.Router();

const identityDocsUpload = upload.fields([
    { name: 'profileImageUrl', maxCount: 1 },
    { name: 'frontImageUrl', maxCount: 1 },
    { name: 'backImageUrl', maxCount: 1 },
    { name: 'selfieImageUrl', maxCount: 1 },
    { name: 'documentUrl', maxCount: 1 },
    { name: 'landlordIdUrl', maxCount: 1 },
]);

const sellerDocsUpload = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'tradeLicense', maxCount: 1 },
    { name: 'emiratesId', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
    { name: 'vatCertificate', maxCount: 1 },
]);

router.post('/admin-signup', upload.single('profilePhoto'), adminSignup);
router.post('/admin-login', adminLogin);
router.get('/admin-get', authMiddleware(['admin']), adminGet);
router.post('/admin-logout', adminLogout);

router.post('/add-new-buyer', authMiddleware(['admin']), identityDocsUpload, addNewBuyer);

router.post('/add-new-seller',authMiddleware(['admin']), (req, res, next) => {
        sellerDocsUpload(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: "File size exceeds 10MB limit"
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: err.message || "Invalid file upload"
                });
            }

            next();
        });
    },
    addNewSeller
);

router.get('/all-sellers-list', authMiddleware(['admin']), getAllSellers);
router.patch('/toggle-seller-verification/:sellerId', authMiddleware(['admin']), toggleSellerVerification);

export default router;