import express from 'express';
import ProductHandler from '../handlers/products';

const router = express.Router();
const productHandler = new ProductHandler();

router.get('/', productHandler.getProducts);
router.get('/refnum/:id', productHandler.getProductById);
router.get('/name/:name', productHandler.getProductByName);

router.post('/', productHandler.createProduct);
router.put('/:id', productHandler.updateProduct);
router.delete('/:id', productHandler.deleteProduct);

export default router;