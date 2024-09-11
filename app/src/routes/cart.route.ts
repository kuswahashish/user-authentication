import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authToken } from '../services/authToken.service';

const router = Router();

router.post('/', authToken.verifyAuthToken, cartController.updateCart);
router.put('/decrease/:id', authToken.verifyAuthToken, cartController.decreaseProductQuantity);
router.put('/remove/:id', authToken.verifyAuthToken, cartController.removeProductFromCart);
router.delete('/', authToken.verifyAuthToken, cartController.clearCart);
router.get('/', authToken.verifyAuthToken, cartController.myCart);

export default router;
