import express from 'express'
import {dellete, dislike, getUser, like, subscribe, unsubscribe, update} from "../controllers/user.js"
import { verifytoken } from '../verifyToken.js'

const router = express.Router()

router.put("/:id",verifytoken, update)

router.delete("/:id",verifytoken,dellete)

router.get("/find/:id",getUser)

router.put("/sub/:id",verifytoken,subscribe)

router.put("/unsub/:id",verifytoken,unsubscribe)

router.put("/like/:videoid",verifytoken,like)

router.put("/dislike/:videoid",verifytoken,dislike)

export default router
