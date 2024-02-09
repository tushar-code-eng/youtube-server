import express from 'express'
import { addComment, deleteComment, getComment } from "../controllers/Comments.js"
import { verifytoken } from '../verifyToken.js'


const router = express.Router()

router.post("/",verifytoken,addComment)

router.delete("/:id",verifytoken,deleteComment)

router.get("/:videoId",verifytoken,getComment)

export default router
