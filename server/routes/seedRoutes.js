import express from 'express'
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    await Product.deleteMany({}); 
    const createdProducts = await Product.insertMany(data.products)//insert an array of products to the product model in teh database 
    await User.deleteMany({}); 
    const createdUsers = await User.insertMany(data.users)//insert an array of products to the product model in teh database 
    res.send({createdProducts, createdUsers})
});

export default seedRouter; 