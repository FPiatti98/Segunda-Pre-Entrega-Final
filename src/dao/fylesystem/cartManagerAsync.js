import * as fs from 'fs';
import ProductManager from "./ProductManagerAsync.js";

class cartManager {

    constructor (path){
        this.path = path;
        this.carts = [];
    };

    async createCart(){
        const fileNameCart = this.path + "/cart.json";

        const cart = {
            id: 0,
            products: []
        };

        if(!fs.existsSync(fileNameCart)){

            cart.id = 1
            this.carts.push(cart)
            const productsCartStr = JSON.stringify(this.carts);
            await fs.promises.writeFile(fileNameCart, productsCartStr);
            return (`El carrito con el id ${cart.id} fue creado exitosamente`)

        } else {
            let contenido = await fs.promises.readFile(fileNameCart, "utf-8");
            const cartsRead = JSON.parse(contenido);
            //obtiene el ultimo id del array y le suma uno para luego asignarlo al id del nuevo carrito
            const newCartId = cartsRead[cartsRead.length - 1].id + 1;
            cart.id = newCartId;
            this.carts = cartsRead;
            this.carts.push(cart);
            const productsCartStr = JSON.stringify(this.carts);
            await fs.promises.writeFile(fileNameCart, productsCartStr);
            return (`El carrito con el id ${cart.id} fue creado exitosamente`)
        }
    }

    async getCartProducts(idParam){
        const fileNameCart = this.path + "/cart.json";
        if(!fs.existsSync(fileNameCart)){
            return "non_existant"
        } else {
            let contenido = await fs.promises.readFile(fileNameCart, "utf-8");
            const cartsRead = JSON.parse(contenido);

            const cartsIds = [];

            cartsRead.forEach((cart) => {
                cartsIds.push(cart.id)
            });

            if(cartsIds.includes(idParam)){
                const arrprod = cartsRead.filter(cart => cart.id === idParam);
                const index = cartsRead.indexOf(arrprod[0]);
                //si el idparam existe en el array busca el carrito y accede a su propiedad products para devolverlo
                return cartsRead[index].products;
            } else {
                return "no_id"
            }
        }
    }

    async addCartProduct(cartId, prodId){

        const fileNameCart = this.path + "/cart.json";
        if(!fs.existsSync(fileNameCart)){return (`El JSON en el path ${fileNameCart} es inexistente`)};

        let contenido = await fs.promises.readFile(fileNameCart, "utf-8");
        const cartsRead = JSON.parse(contenido);

        const cartsIds = [];

        cartsRead.forEach((cart) => {
            cartsIds.push(cart.id)
        });
        

        if(cartsIds.includes(cartId)){
            //trae el producto que se va a querer agregar
            const product = await Products.getProductById(prodId);
            if(product == "Not Found" || product == "nonexistant"){
                return (`El producto con el id ${prodId} no existe`)
            };
            const arrcart = cartsRead.filter(cart => cart.id === cartId);
            const indexCart = cartsRead.indexOf(arrcart[0]);
            //trae el carrito al que se le va a querer agregar dicho producto
            const selectedCart = cartsRead[indexCart];

            const arrprod = selectedCart.products.filter(prod => prod.id === product.id);
            const indexProd = selectedCart.products.indexOf(arrprod[0]);
            const prod = selectedCart.products[indexProd];
            //accede a la porpiedad products del carrito seleccionado

            if(prod){
                //si ya existe el producto agrega +1 a quantity
                prod.quantity = prod.quantity + 1;  
            } else {
                selectedCart.products.push({id : product.id, quantity : 1});
            }

            const updatedCartsStr = JSON.stringify(cartsRead);
            await fs.promises.writeFile(fileNameCart, updatedCartsStr);

        } else {
            return (`El carrito con el id ${cartId} no existe`);
        };
    };
};

const Products = new ProductManager("./filesasync")

export default cartManager;