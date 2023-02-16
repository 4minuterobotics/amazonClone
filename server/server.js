import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import data from './data.js';

import homeScreenRoute from './routes/homeScreenRoute.js';

//initialize express application
const app = express();

//set up some middlewares
app.use(cors()); //this will allow us to make cross origin requests and allow our server to be called from the fornt end

// static api endpoints that we can connect and hook onto from the font end side
// ...... (get request route, action)
app.use('/api/products', homeScreenRoute);

// dynamic api endpoint to retrieve data based on ending of dynamic url
app.get('/api/products/slug/:slug', (req, res) => {
	console.log('made it to product screen route. attempting if statement...');
	const product = data.products.find((x) => x.slug === req.params.slug);
	console.log(req.params.slug);
	//console.log(req);
	if (product) {
		try { 
			console.log('generating response');
			res.send(product);
			console.log('data was sent to front end');
		} catch (error) {
			console.log('on home screen route page finna log an error cuz it aint work');
			console.log(error);
		}
	} else {
		console.log("product aint here")
		 res.status(404).send({ message: 'Product doesnt exist' });
	}
});

//when users go to this address, we will return a message to the front end.
app.get('/', (req, res) => {
	res.send('Hello from Foo Amazon');
});

//the variable port is being set to process.env.PORT which is whatever port is free.
//But if it doesn't set, we're setting the port to 5000.
const port = process.env.PORT || 5000;

//this starts the server to be ready to be responding to the front ened.
app.listen(port, () => {
	console.log(`server at http://localhost:${port}`);
});
