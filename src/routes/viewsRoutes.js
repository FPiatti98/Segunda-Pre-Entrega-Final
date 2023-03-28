import {response, Router} from 'express';
import ProductManager from "../dao/fylesystem/ProductManagerAsync.js";
import { productModel } from '../dao/mongodb/models/product.model.js';
import { cartModel } from '../dao/mongodb/models/cart.model.js';

const router = Router();

/*
router.get('/', async (request,response) => {

    let limit = request.query.limit;
    //Traer todos los productos del JSON
    let productsRead = await Products.getProducts();

        if(limit <= productsRead.length){
            const newarr = [];
            //Crea un nuevo array para treaer a los productos con el limite
            for (let i = 1; i <= limit; i++){
                newarr.push(productsRead[i-1])
            }
            response.render('realTimeProducts',{
                products:newarr
            });
        } else {
            response.render('realTimeProducts', {
                products:productsRead
            });
        }
});

const Products = new ProductManager("./filesasync");
*/

router.get('/products', async (req, res) => {
    try {

        let Products = {};
        let limit = req.query.limit;
        let page = req.query.page;
        const sort = req.query.sort;
        const category = req.query.category;
        const stock = req.query.stock;
        const usuario = req.session.user

        if ( !limit || !page ){
            limit = 10;
            page = 1;
        };

        if (category && stock){
            Products = await productModel.paginate({category : category, stock: {$gt: stock}},{limit: limit, page: page, sort: {price: sort}, lean : true});
        } else if (category && !stock){
            Products = await productModel.paginate({category : category},{limit: limit, page: page, sort: {price: sort}, lean : true});
        } else if (!category && stock){
            Products = await productModel.paginate({stock: {$gt: stock}},{limit: limit, page: page, sort: {price: sort}, lean : true});
        } else {
            Products = await productModel.paginate({},{limit: limit, page: page, sort: {price: sort}, lean : true});
        }

        Products.prevLink = Products.hasPrevPage? `http://localhost:8080/products?page=${Products.prevPage}&limit=${Products.limit}`:'';
        Products.nextLink = Products.hasNextPage? `http://localhost:8080/products?page=${Products.nextPage}&limit=${Products.limit}`:'';
        Products.isValid= !(page<=0||page>Products.totalPages);

        res.render('products', {products: Products, user: usuario});

    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
})

router.get('/carts/:id', async(req, res) => {
    try {
        const cart = await cartModel.findById(req.params.id).populate('products._id').lean();
        return res.render('Cart', {cart : cart});
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
})

export default router
