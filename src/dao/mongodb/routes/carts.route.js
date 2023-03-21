import { Router } from "express";
import { createCart , getCartById , addProdToCart , deleteProdinCart , updateProdQuantity , deleteProdsInCart } from "../controller/carts.controller.js";

const router = Router();

router.post('/carts', createCart);
router.get('/carts/:id', getCartById);
router.post('/carts/:cid/product/:pid', addProdToCart);
router.delete('/carts/:cid/product/:pid', deleteProdinCart);
router.put('/carts/:cid/product/:pid', updateProdQuantity);
router.delete('/carts/:cid', deleteProdsInCart);

export default router;