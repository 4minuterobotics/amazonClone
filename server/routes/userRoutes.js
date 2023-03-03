import express from 'express'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { generateToken } from '../utils.js'

const userRouter = express.Router()

//by using this async function we can catch the error in the async function inside it
userRouter.post('/signin',expressAsyncHandler(async(req,res) =>{
    const user = await User.findOne({email: req.body.email});
    if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
            console.log('login data passed to backend successully')
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            });
            return;
        }
    }
    res.status(401).send({message: 'Invalid email or password'})
}))

userRouter.post('/signup',expressAsyncHandler(async(req, res) => {
    console.log('entered signup post route')
    //create a new mongoDB user document from the User model
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false
    })
    console.log(newUser)
    //save the document to mongodb, which will generate an ID 
    const user= await newUser.save();
    console.log('new user saved in database. user is: ')
    console.log(user);
    console.log(typeof user)
    //send the user data to the front end.
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user), 
    });
}))

export default userRouter;