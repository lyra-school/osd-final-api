import express, {Router} from 'express';
import {
    getAllBirds,
    getAllBirdsFromFamily,
    getBirdFromID,
    createBird,
    updateBird,
    deleteBird
} from '../controllers/birds';
import { isOwnerOrAdminBird, validJWTProvided } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.get('/', getAllBirds);
router.get('/family/:name', getAllBirdsFromFamily);
router.get('/:id', getBirdFromID);
router.post('/', validJWTProvided, createBird);
router.put('/:id', validJWTProvided, isOwnerOrAdminBird, updateBird);
router.delete('/:id', validJWTProvided, isOwnerOrAdminBird, deleteBird);

export default router;