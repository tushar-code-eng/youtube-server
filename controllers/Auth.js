import mongoose from 'mongoose'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { createError } from '../Error.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const UserSignup = async (req, res, next) => {
    const {name,email,password,senddp} = req.body
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)  
        const newUser = new User({ name,email,password: hash,img:senddp })
        
        const savedUser = await newUser.save()
        const token = jwt.sign({ id: savedUser._id }, process.env.JWTKEY)
        console.log(savedUser)
        const { password, ...other } = savedUser._doc
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(other)
    } catch (err) {
        next(err)
    }
}

export const UserSignin = async (req, res, next) => {
    try {
        //Get User from the database
        const user = await User.findOne({ name: req.body.name })
        if (!user) return next(createError(404, "User not found"))

        //Checking the password
        const checkpass = await bcrypt.compare(req.body.password, user.password)
        if (!checkpass) return next(createError(400, "Wrong password"))

        //now we will do this bec we will send every detail except the password
        const { password, ...other } = user._doc

        const token = jwt.sign({ id: user._id }, process.env.JWTKEY)

        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(other)
    } catch (err) {
        next(err)
    }
}

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWTKEY)

            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json(user._doc)
        }else{
            const newUser = new User({
                ...req.body,
                fromGoogle:true
            })

            const savedUser = await newUser.save()

            const token = jwt.sign({ id: user._id }, process.env.JWTKEY)

            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json(savedUser._doc)
        }
    }
    catch (err) {
        next(err)
    }
}   

export const UserSignout = (req,res,next)=>{
    res.cookie('access_token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    })
    res
        .status(200)
        .json({ success: true, message: 'User logged out successfully' })
}
