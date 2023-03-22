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


orderRouter.get('/:id', isAuth, expressAsyncHandler(async(req,res) =>{
    console.log('sending order summary to front end')
        const order = await Order.findById(req.params.id);
        if (order){
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found'})
        }
    })
);

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler (async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        }

        const updatedOrder = await order.save();
        res.send ({message: 'Order Paid', order: updatedOrder})
    } else {
        res.status(404).send({ message: 'Order Not Found'})
    }
})
)
export default orderRouter; 