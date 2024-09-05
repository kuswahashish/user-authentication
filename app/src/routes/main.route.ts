import express from 'express';
const router = express.Router();
// const VERIFY = require('../util/userAuth');
import userRoutes from './user.route';
import userAuthRoutes from './userAuth.routes';
import productRoutes from './product.route';
import cartRoutes from './cart.route';




router.use('/users', userRoutes);
router.use('/users/auth', userAuthRoutes);
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);


export default router;