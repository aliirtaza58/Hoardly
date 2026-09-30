import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cart.js';

const router = Router();

router.use(requireAuth);
router.get('/', getCart);
router.post('/', addCartItem);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);
router.delete('/', clearCart);

export default router;
