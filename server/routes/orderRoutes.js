import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import { isAuth } from '../utils.js'

const orderRouter = express.Router()

//by using this async function we can catch the error in the async function inside it
orderRouter.post('/', isAuth, expressAsyncHandler(async(req,res) =>{
    console.log('got order request from front end')
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) =>({ ...x, product: x._id})),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
    });

    const order = await newOrder.save()
    res.status(201).send({ message: 'New Order Created', order})
}));
export default orderRouter;