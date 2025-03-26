import express, {Router} from 'express';
import {
    getAllSightings,
    getSightingFromID,
    createSighting,
    updateSighting,
    deleteSighting,
} from '../controllers/sightings';
import { isOwnerOrAdminSighting, validJWTProvided } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.get('/', getAllSightings);
router.get('/:id', getSightingFromID);
router.post('/', validJWTProvided, createSighting);
router.put('/:id', validJWTProvided, isOwnerOrAdminSighting, updateSighting);
router.delete('/:id', validJWTProvided, isOwnerOrAdminSighting, deleteSighting);

export default router;