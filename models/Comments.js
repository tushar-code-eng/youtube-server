import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    videoId:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
}, { timestamps: true })

const COMMENT = mongoose.model("Comments",CommentSchema)

export default COMMENT