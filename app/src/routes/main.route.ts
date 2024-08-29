import express from 'express';
const router = express.Router();
// const VERIFY = require('../util/userAuth');
import userRoutes from './user.route';
import userAuthRoutes from './userAuth.routes';


router.use('/users', userRoutes);
router.use('/users/auth', userAuthRoutes);

export default router;