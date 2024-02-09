import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
    },
    img:{
        type: String,
    },
    subscribers:{
        type: Number,
        default: 0,
    },
    subscribedUsers:{
        type: [String],
    },
    fromGoogle:{
        type: Boolean,
        default: false,
    }

}, { timestamps: true })

const USERS = mongoose.model("User",UserSchema)

export default USERS