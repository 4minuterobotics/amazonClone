import express from 'express'
import data from '../data.js';
import Product from '../models/productModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    await Product.deleteOne({}); 
    const createdProducts = await Product.insertMany(data.products)//insert an array of products to the product model in teh database 
    res.send({createdProducts})
});

export default seedRouter;