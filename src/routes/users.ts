import express, { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    createAdminUser
} from '../controllers/users';
import { isAdmin, isOwnerOrAdmin, validJWTProvided } from '../middleware/auth.middleware';

const router: Router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/admin', validJWTProvided, isAdmin, createAdminUser);
router.put('/:id', validJWTProvided, isOwnerOrAdmin, updateUser);
router.delete('/:id', validJWTProvided, isOwnerOrAdmin, deleteUser);

export default router;