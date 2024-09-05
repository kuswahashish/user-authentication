import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authToken } from '../services/authToken.service';

const router = Router();

router.post('/', authToken.verifyAuthToken, cartController.updateCart);
router.put('/decrease/:id', cartController.decreaseProductQuantity);
router.put('/remove/:id', cartController.removeProductFromCart);

router.get('/:id', cartController.getProductById);
router.put('/:id', cartController.updateProduct);
router.delete('/:id', cartController.deleteProduct);

export default router;
