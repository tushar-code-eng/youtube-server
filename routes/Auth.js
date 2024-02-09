import express from 'express'
import {UserSignup,UserSignin,googleAuth , UserSignout} from "../controllers/Auth.js"

const router = express.Router()

//create user
router.post("/signup",UserSignup)

//sign in
router.post("/signin",UserSignin)

//google auth
router.post("/google",googleAuth)

//signout
router.get("/signout",UserSignout)


export default router
