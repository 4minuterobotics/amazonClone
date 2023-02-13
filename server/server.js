import express from 'express';
import data from './data.js';

const app = express();

//when users go to this address, we will return products to the front end.
app.get('/api/products', (req, res) => {
	res.send(data.products);
});

//the variable port is being set to process.env.PORT which is whatever port is free.
//But if it doesn't set, we're setting the port to 5000.
const port = process.env.PORT || 5000;

//this starts the server to be ready to be responding to the front ened.
app.listen(port, () => {
	console.log(`server at http://localhost:${port}`);
});
