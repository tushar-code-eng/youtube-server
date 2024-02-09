import jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
import { createError } from "./Error.js";

dotenv.config()

export const verifytoken =async  (req,res,next)=>{
    const token =await req.cookies.access_token
    if(!token) return res.status(401).json("SignIn to Continue")

    jwt.verify(token,process.env.JWTKEY,(err,user)=>{
        if(err) return next(createError(403,"Token not valid"))
        req.user = user
        next()
    })
}
