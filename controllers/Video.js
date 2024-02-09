import { createError } from "../Error.js"
import Video from "../models/Video.js"
import User from "../models/User.js"

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body })
    try {
        console.log('hit')
        const savedVideo = await newVideo.save()
        res.status(200).json(savedVideo)
    } catch (err) {
        next(err)
    }
}


export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return next(createError(404, "Video not found"))
        if (req.user.id === Video.userId) {
            const updatevid = await Video.findOneAndUpdate(req.params.id, {
                $set: { userId: req.user.id, ...req.body }
            },
                { new: true })
            res.status(200).json(updatevid)
        } else {
            return next(createError(403, "You can only update your video"))
        }
    } catch (err) {
        next(err)
    }

}


export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return next(createError(404, "Video not found"))
        if (req.user.id === Video.userId) {
            await Video.findOneAndDelete(req.params.id)
            res.status(200).json("Your Video has been deleted")
        } else {
            return next(createError(403, "You can only delete your video"))
        }
    } catch (err) {
        next(err)
    }
}


export const getVideo = async (req, res, next) => {
    try {
        const vid = await Video.findById(req.params.id)
        res.status(200).json(vid)
    } catch (err) {
        next(err)
    }
}


export const addView = async (req, res, next) => {
    try {
        console.log(req.params.id)
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        })
        res.status(200).json("view has been increased")
    } catch (err) {
        next(err)
    }
}


export const random = async (req, res, next) => {
    try {
        const randomvid = await Video.aggregate([{ $sample: { size: 40 } }])
        res.status(200).json(randomvid)

    } catch (err) {
        next(err)
    }
}


export const trend = async (req, res, next) => {
    try {
        const trendvid = await Video.find().sort({ views: -1 }) // -1 will get the most viwed videos 
        res.status(200).json(trendvid)
    } catch (err) {
        next(err)
    }
}


//for subscribed videos
export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedchannels = user.subscribedUsers

        const list = await Promise.all(
            subscribedchannels.map((channelId) => {
                return Video.find({ userId: channelId })
            }))
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt)) //flat will remove nested array and sort will just sort
    } catch (err) {
        next(err)
    }
}


export const getByTag = async (req, res, next) => {
    const searchtags = req.query.tags.split(",") //here this will take all the tags written under tags
    try {
        const videos = await Video.find({ tags: { $in: searchtags } }).limit(20)
        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}


export const search = async (req, res, next) => {
    const query = req.query.q //here this will take all the tags written under q
    try {
        const videos = await Video.find({ title: { $regex: query, $options: "i" } }).limit(40) // regex is used to search and i means it doesnt matter whether the search is in upper or lower case
        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}

