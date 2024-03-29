import express from 'express';
import path from 'path';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors';
import productRouter from './routes/productRoutes.js';
import seedRouter from './routes/seedRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config();//fetch variables in the .env file
mongoose.connect(process.env.MONGODB_URI) // connect to the mongodb database
.then(()=>{
	console.log('connected to db');
})
.catch ((err) =>{
	console.log(err.message)
})



//initialize express application
const app = express();

app.use(cors()); //this will allow us to make cross origin requests and allow our server to be called from the fornt end

//set up some middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
 
app.get('/api/keys/paypal', (req, res) =>{
	console.log (typeof process.env.PAYPAL_CLIENT_ID)
	res.send(process.env.PAYPAL_CLIENT_ID || 'sb') // sb is short for sandbox
})

// static api endpoints that we can connect and hook onto from the font end side
// ...... (get request route, action)
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// const __dirname = path.resolve();//this gets the directory name from path.resolve. it returns the current directory. 
// app.use(express.static(path.join(__dirname, '/client/build'))) // this serves all files inside the frontend/build folder as a static file
// app.get('*', (req, res) =>
// 	res.sendFile(path.join(__dirname, '/client/build/index.html'))
// ); // everything the user enters after the server name is gonna be served by this html file

app.use((err, req, res, next) =>{
	res.status(500).send({message: err.message});
})



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
