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
                token: generateToken(User),
            });
            return;
        }
    }
    res.status(401).send({message: 'Invalid email or password'})
}))

export default userRouter;