import { mongo } from "mongoose";
import { cartModel } from "../models/cart.model.js";

export const createCart = async(req, res) => {
    try {
        const newcart = new cartModel
        const cart = await newcart.save();
        return res.send(cart);
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
};

export const getCartById = async(req, res) => {
    try {
        const cart = await cartModel.findById(req.params.id)
        const newCart = await cart.populate('products._id');
        return res.send(newCart);
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
}

export const addProdToCart = async(req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);

        const arrprod = cart.products.filter(prod => prod._id.toString() === req.params.pid);
        
        if(!arrprod[0]){

            cart.products.push({_id : new mongo.ObjectId(req.params.pid) , quantity : 1});
            const newCart = await cart.save();
            return res.send(newCart);

        } else {
        
            const newQuantity = arrprod[0].quantity + 1
            const updatedCart = await cartModel.updateOne(
                {
                    "_id" : cart._id,
                    "products": {"$elemMatch": { "_id": arrprod[0]._id }}
                },
                {
                    "$set": { "products.$.quantity": newQuantity}
                }
            );

            /*
            //sin el model
            const productArr = cart.products.filter(prod => prod._id === req.params.id)

            if (productArr){
                productArr[0].quantity ++
                Cart.save();
            } else {
                cart.products.push({_id : new mongo.ObjectId(req.params.pid) , quantity : 1});
                    const newCart = await cart.save();
                    return res.send(newCart)
            }
            */

            /*
            db.updateOne(
                // $elemMatch finds docs containing an array with a matching element
                {
                    "trees": { "$elemMatch": { "poken": 5 }}
                },
                // Positional operator $ is a placeholder for the first matching array element
                {
                    "$set": { "trees.$.poken": 7 }
                }
            );
            */

            return res.send(updatedCart);
        }

    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
}

export const deleteProdinCart = async(req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);
        
        cart.products.forEach((prod) => {
            if(prod._id.toString() === req.params.pid){
                let index = cart.products.indexOf(prod)
                cart.products.splice(index, 1);
            }
        });

        const newCart = await cart.save();
        return res.send(newCart);

    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
};

export const updateProdQuantity = async(req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);

        const arrprod = cart.products.filter(prod => prod._id.toString() === req.params.pid);
        
        const newQuantity = req.body.quantity

        if(!newQuantity){
            return res.status(500).send({status: "error", message : "Quantity no existe en el body rel request"});
        } else {
            const updatedCart = await cartModel.updateOne(
                {
                    "_id" : cart._id,
                    "products": {"$elemMatch": { "_id": arrprod[0]._id }}
                },
                {
                    "$set": { "products.$.quantity": newQuantity}
                }
                );

            return res.send(updatedCart);
        }

    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
};

export const deleteProdsInCart = async(req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);

        const updatedCart = await cartModel.updateOne({_id : cart._id}, {products : []});

        return res.send(updatedCart);
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
};

