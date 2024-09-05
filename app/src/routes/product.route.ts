import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import upload from '../services/multerHandler.service';

const router = Router();

router.post('/', upload.array('file'), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.single('file'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
