import express from 'express';
import data from './data.js';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRouter from './routes/productRoutes.js';
import seedRouter from './routes/seedRoutes.js';
import userRouter from './routes/userRoutes.js';

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

//set up some middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
 

// static api endpoints that we can connect and hook onto from the font end side
// ...... (get request route, action)
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);





//when users go to this address, we will return a message to the front end.
app.get('/', (req, res) => {
	res.send('Hello from Foo Amazon');
});



app.use((err, req, res, next) =>{
	res.status(500).send({message: err.message});
})



//the variable port is being set to process.env.PORT which is whatever port is free.
//But if it doesn't set, we're setting the port to 5000.
const port = process.env.PORT || 5000;

//this starts the server to be ready to be responding to the front ened.
app.listen(port, () => {
	console.log(`server at http://localhost:${port}`);
});
