import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import upload from '../services/multerHandler.service';

const router = Router();

router.post('/', upload.single('file'), createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id',upload.single('file'), updateUser);
router.delete('/:id', deleteUser);
export default router;
