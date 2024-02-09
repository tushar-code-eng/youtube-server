import { createError } from "../Error.js"
import User from '../models/User.js'
import Video from "../models/Video.js"

export const update = async (req, res, next) => {
    if (req.params.id == req.user.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body //this will update the whole value with the new value.
            },
                { new: true })//return the updated user data
            res.status(200).json(updateUser)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can update only your account"))
    }
}


export const dellete = async (req, res, next) => {
    if (req.params.id == req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can delete only your account"))
    }

}


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}


export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { subscribedUsers: req.params.id } // this will push the subscribing id to the list of subscribers
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }, //this will increase the subscriber count
        })
        res.status(200).json("Subscription succesfull")
    } catch (err) {
        next(err)
    }
}


export const unsubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id } // this will pull the subscribing id to the list of subscribers
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }, //this will decrease the subscriber count
        })
        res.status(200).json("Unsubscription succesfull")
    } catch (err) {
        next(err)
    }
}


export const like = async (req, res, next) => {
    const likeUser = req.user.id
    const likeVideo = req.params.videoid
    try {
        await Video.findByIdAndUpdate(likeVideo,{
            $addToSet:{likes:likeUser},  // We did not use push method because it will like the video more than once
            $pull:{dislikes:likeUser}
        })
        res.status(200).json("Video has been liked")
    }
    catch (err) {
        next(err)
    }
}


export const dislike = async (req, res, next) => {
    const dislikeUser = req.user.id
    const dislikeVideo = req.params.videoid
    try {
        await Video.findByIdAndUpdate(dislikeVideo,{
            $addToSet:{dislikes:dislikeUser},  // We did not use push method because it will like the video more than once
            $pull:{likes:dislikeUser}
        })
        res.status(200).json("Video has been disliked")
    }
    catch (err) {
        next(err)
    }
}