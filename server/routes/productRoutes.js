import express from 'express';
import * as dotenv from 'dotenv';
import data from '../data.js';
import Product from '../models/productModel.js';

dotenv.config();

const productRouter = express.Router();

//	LONG WAY TO GET ALL POSTS FROM back end without using static database
// productRouter.route('/').get(async (req, res) => {
// 	try {
// 		console.log('generating response');
// 		res.send(data.products);
// 	} catch (error) {
// 		console.log('on home screen route page finna log an error cuz it aint work');
// 		console.log(error);
// 	}
// });


// dynamic api endpoint to retrieve data based on ending of dynamic url
// app.get('/api/products/slug/:slug', (req, res) => {
// 	console.log('made it to product screen route. attempting if statement...');
// 	const product = data.products.find((x) => x.slug === req.params.slug);
// 	console.log(req.params.slug);
// 	//console.log(req);
// 	if (product) {
// 		try { 
// 			console.log('generating response');
// 			res.send(product);
// 			console.log('data was sent to front end using slug API');
// 		} catch (error) {
// 			console.log('on home screen route page finna log an error cuz it aint work');
// 			console.log(error);
// 		}
// 	} else {
// 		console.log("product aint here")
// 		 res.status(404).send({ message: 'Product doesnt exist' });
// 	}
// });


// // dynamic api endpoint to retrieve data based on ending of dynamic url being an id number
// app.get('/api/products/:id', (req, res) => {
// 	console.log('made it to product screen route. attempting if statement...');
// 	const product = data.products.find((x) => x._id === req.params.id);
// 	console.log(req.params.id);
// 	//console.log(req);
// 	if (product) {
// 		try { 
// 			console.log('generating response');
// 			res.send(product);
// 			console.log('data was sent to front end using id API. what was send was:');
// 			console.log(product)
// 		} catch (error) {
// 			console.log('on home screen route page finna log an error cuz it aint work');
// 			console.log(error);
// 		}
// 	} else {
// 		console.log("product aint here")
// 		 res.status(404).send({ message: 'Product doesnt exist' });
// 	}
// });


//	SHORT WAY TO GET ALL POSTS FROM back end using mongoDB database
productRouter.get('/', async (req, res) => {
	console.log ("sending shit to home page")
	const products = await Product.find();
	res.send(products);
	console.log (products)
});

// dynamic api endpoint to retrieve data based on ending of dynamic url
productRouter.get('/slug/:slug', async  (req, res) => {
	const product = await Product.findOne({slug: req.params.slug});
	if (product) {
			res.send(product);
	} else {
		console.log("Product Not Found")
		 res.status(404).send({ message: 'Product does not exist' });
	}
});


// dynamic api endpoint to retrieve data based on ending of dynamic url being an id number
productRouter.get('/:id', async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
			res.send(product);
	} else {
		console.log("product aint here")
		 res.status(404).send({ message: 'Product does not exist' });
	}
});

export default productRouter;
