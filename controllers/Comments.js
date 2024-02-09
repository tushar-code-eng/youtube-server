import { createError } from "../Error.js"
import Comment from "../models/Comments.js"
import Video from "../models/Video.js"

export const addComment = async (req, res, next) => {
    const {newcomment,videoId} = req.body
    try {
        const newComment = new Comment({  desc:newcomment,videoId,userId: req.user.id })
        console.log('hit')
        const saveComment = await newComment.save()
        console.log(saveComment)
        res.status(200).send(saveComment)
    }
    catch (err) {
        next(err)
    }
}


export const deleteComment = async (req, res, next) => {
    try {
        const commentt = await Comment.findById(req.params.id)
        const video = await Video.findById(req.params.id)
        if (req.params.id === commentt.userId || req.user.id === video.userId) {
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json("comment has been dele ted")
        } else {
            return next(createError(403, "You can only delete your comment"))
        }
    }
    catch (err) {
        next(err)
    }
}


export const getComment = async (req, res, next) => {
    try {
        const comments = await Comment.find({videoId:req.params.videoId})
        res.status(200).json(comments)
    }
    catch (err) {
        next(err)
    }
}