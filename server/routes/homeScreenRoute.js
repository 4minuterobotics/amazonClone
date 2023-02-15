import express from 'express';
import * as dotenv from 'dotenv';
import data from '../data.js';

dotenv.config();

const homeScreenRoute = express.Router();

//GET ALL POSTS FROM back end
homeScreenRoute.route('/').get(async (req, res) => {
	try {
		console.log('generating response');
		res.send(data.products);
	} catch (error) {
		console.log('on home screen route page finna log an error cuz it aint work');
		console.log(error);
	}
});

export default homeScreenRoute;
