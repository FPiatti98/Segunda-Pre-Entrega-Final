import {response, Router} from 'express';
import ProductManager from "../ProductManagerAsync.js";

const router = Router();

router.get('/products', async (request,response) => {

    let limit = request.query.limit;
    //Traer todos los productos del JSON
    let productsRead = await Products.getProducts();

        if(limit <= productsRead.length){
            const newarr = [];
            //Crea un nuevo array para treaer a los productos con el limite
            for (let i = 1; i <= limit; i++){
                newarr.push(productsRead[i-1])
            }
            response.render('home',{
                products:newarr
            });
        } else {
            response.render('home', {
                products:productsRead
            });
        }
});

router.get('/products/:id', async (request,response) => {

    const id = parseInt(request.params.id); 

    //Trae el producto con el idParam
    const prod = await Products.getProductById(id);

    //Checkea si el file existe o si el id del producto existe
    if (prod == "nonexistant"){
        response.status(400).send({status: "Error", message: "El archivo al que se intenta acceder es inexistente"});
    } else if(prod == "Not Found"){
        response.status(400).send({status: "Error", message: `El producto con el id ${id} es inexistente`});
    } else {
        response.send(prod);
    }

});

router.post('/', async (request, response) => {
    let product = request.body;
    let estado = await Products.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.category);
    if(estado){
        response.status(400).send({status: "Error", message: estado});
    } else {  
        response.status(200).send({status: "Successful", message: `El producto fue agregado exitosamente`});
    }
});

router.put('/:id', async (request, response) => {

    const reqId = parseInt(request.params.id);

    //checkea si se esta intentando cambiar el id
    if (request.body.id){
        return response.status(400).send({status: "Error", message: "No es posible cambiar el Id del producto"});
    }

    const check = await Products.updateProduct(reqId, request.body);

    //si lo que devuelve el metodo es un error envia un status 400
    if (check){
        return response.status(400).send({status: "Error", message: check});
    } else {
        return response.status(200).send({status: "Successful", message: `El producto con el id ${reqId} fue actualizado exitosamente`});
    }

});

router.delete('/:id', async (request, response) => {

    const id = parseInt(request.params.id); 
    const check = await Products.deleteProduct(id);
    //si lo que devuelve el metodo es un error envia un status 400
    if (check){
        return response.status(400).send({status: "Error", message: check});
    }else {
        return response.send({status: "Successful", message: `El producto con el id ${id} fue eliminado exitosamente`});
    }
});

const Products = new ProductManager("./filesasync");

export default router;
