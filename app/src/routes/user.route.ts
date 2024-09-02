import { Router } from 'express';
import { userControl } from '../controllers/user.controller';
import upload from '../services/multerHandler.service';

const router = Router();

router.post('/', upload.single('file'), userControl.createUser);
router.get('/', userControl.getUsers);
router.get('/:id', userControl.getUserById);
router.put('/:id', upload.single('file'), userControl.updateUser);
router.delete('/:id', userControl.deleteUser);

export default router;
