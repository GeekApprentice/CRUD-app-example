import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js'

export const signIn = async (req, res) => {
    const {email, password} = req.body

    try {
        const existingUser = await User.findOne({email})
        if(!existingUser) {
            return res.status(404).json({message: 'user not found'})
        }

        const isPassword = await bcrypt.compare(password, existingUser.password)

        if(!isPassword) {
            return res.status(400).json({message: 'invalid credentials'})
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '1h'})

        res.status(200).json({result: existingUser, token})
    } catch (error) {
        res.status(500).json({message: 'something went wrong'})
    }
}

export const signUp = async (req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body

    try {
        const existingUser = await User.findOne({email})

        if(existingUser) {
            return res.status(400).json({message: 'user already exists'});
        } 

        if(password !== confirmPassword) {
            return res.status(400).json({message: "Password don't match"});
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user =  new User({email, password: hashedPassword, name: `${firstName} ${lastName}`})
        const result = await user.save()
        const token =  jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: '1h'})

        res.status(201).json({result, token})
    } catch (error) {
        res.status(500).json({message: 'something went wrong'})
        console.log(error);
    }
}