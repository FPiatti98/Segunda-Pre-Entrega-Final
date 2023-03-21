import { productModel } from "../models/product.model.js";

export const createProduct = async(req, res) => {
    try {
        const newProduct = new productModel(req.body);
        const producto = await newProduct.save();
        return res.send(producto)
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
}

export const getAllProducts = async(req, res) => {

    
    try {

        let Products = {};
        let limit = req.query.limit;
        let page = req.query.page;
        const sort = req.query.sort;
        const category = req.query.category;
        const stock = req.query.stock;

        if ( !limit || !page ){
            limit = 10;
            page = 1;
        };

        if (category && stock){
            Products = await productModel.paginate({category : category, stock: {$gt: stock}},{limit: limit, page: page, sort: {price: sort}});
        } else if (category && !stock){
            Products = await productModel.paginate({category : category},{limit: limit, page: page, sort: {price: sort}});
        } else if (!category && stock){
            Products = await productModel.paginate({stock: {$gt: stock}},{limit: limit, page: page, sort: {price: sort}});
        } else {
            Products = await productModel.paginate({},{limit: limit, page: page, sort: {price: sort}});
        }

        Products.prevLink = Products.hasPrevPage? `http://localhost:8080/products?page=${Products.prevPage}`:'';
        Products.nextLink = Products.hasNextPage? `http://localhost:8080/products?page=${Products.nextPage}`:'';

        return res.send(Products)

    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
}

export const getProductById = async(req, res) => {
    try {
        const prod = await productModel.findById(req.params.id);
        return res.send(prod)
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
};

export const updateProduct = async(req, res) => {
    try {
        //const prod = await productModel.updateOne({id : req.params.id}, {});
        const prod = await productModel.findById(req.params.id);
        Object.assign(prod, req.body);
        const updatedProd = await prod.save();
        return res.send(updatedProd);
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
};

export const deleteProduct = async(req, res) => {
    try {
        const deletedProd = await productModel.deleteOne({ _id: req.params.id});
        return res.send(deletedProd);
    } catch (error) {
        return res.status(500).send({status: "error", message : error.message});
    }
};