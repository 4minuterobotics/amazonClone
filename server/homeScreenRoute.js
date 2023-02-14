import express from 'express';
import * as dotenv from 'dotenv';
import data from './data.js';

dotenv.config();

const homeScreenRoute = express.Router();

// old code from server.js and mission objective.
//when users go to this address, we will return products to the front end.
// app.get('/api/products', (req, res) => {
// 	res.send(data.products);
// });

//GET ALL POSTS FROM CLOUDINARY
homeScreenRoute.route('/').get(async (req, res) => {
	try {
		console.log('generating response');
		res.send(data.products);
	} catch (error) {
		console.log('on home screen route page finna log an error cuz it aint work');
		console.log(error);
	}
});

// //CREATE A POST ON CLOUDINARY USING DATA FROM THE FROM FRONT END and store the link in the mongodb Database
// postRoutes.route('/').post(async (req, res) => {
// 	console.log('about to make a new document i think');

// 	try {
// 		const { name, prompt, photo } = req.body; //get the body of the form containing the photo, prompt, and name

// 		const photoUrl = await cloudinary.uploader.upload(photo); //upload the photo to cloudinary and create a link to it
// 		console.log('made it past body cloudinay upload');
// 		const newPost = await Post.create({
// 			//add the data from and the cloudinary link to mongo database
// 			name,
// 			prompt,
// 			photo: photoUrl.url,
// 		});

// 		res.status(201).json({ success: true, data: newPost });
// 		console.log('the newPost._id is');
// 		console.log(newPost._id);
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: error });
// 		console.log('response from database save is an error');
// 	}
// });
export default homeScreenRoute;
