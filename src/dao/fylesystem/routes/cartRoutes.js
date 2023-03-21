import {response, Router} from 'express';
import cartManager from '../cartManagerAsync.js';

const router = Router();

router.post('/carts', async (request, response) => {
    const check = await Carts.createCart();

    return response.status(200).send({status: "Successful", message: check})
});

router.get('/carts/:id', async (request, response) => {
    const id = parseInt(request.params.id); 

    const check = await Carts.getCartProducts(id)

    //Checkea si existe el JSON de los carritos y si el carrito que se busca existe
    if(check === "non_existant"){
        return response.status(400).send({status: "Error", message: "El archivo Carts.json no existe"});
    } else if (check === "no_id"){
        return response.status(400).send({status: "Error", message: `El carrito con el id ${id} es inexistente`});
    } else {
        return response.send(check);
    }
});

router.post('/carts/:cid/product/:pid', async (request, response) => {

    const cartId = parseInt(request.params.cid);
    const prodId = parseInt(request.params.pid);

    const check = await Carts.addCartProduct(cartId, prodId);

    if(check){
        return response.status(400).send({status: "Error", message: check});
    } else {
        return response.status(200).send({status: "Successful", message: `El producto con el id ${prodId} fue agregado al carrito con el id ${cartId} de forma exitosa`});
    }

})

const Carts = new cartManager("./filesasync");

export default router