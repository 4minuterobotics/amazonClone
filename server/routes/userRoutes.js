import express from 'express'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { generateToken, isAuth } from '../utils.js'

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


userRouter.put(
    // console.log("entered user profile put request in backend"),
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
         console.log("entered user profile put request in backend")
        const user = await User.findById(req.user._id);

        // const usersTest = await User.find();
        // console.log("All users:")
        // console.log(usersTest);

        if (user) {
            console.log("Logged in user:")
            console.log(user)
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8)
            }

            const updatedUser = await user.save();
            console.log(updatedUser)
            res.send({

                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser)
            })

            
        } else {
            res.status(404).send({message:'User not found'})
        }
    })
)

export default userRouter;