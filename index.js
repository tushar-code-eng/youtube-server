import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserRoutes from './routes/User.js'
import VideoRoutes from './routes/Videos.js'
import CommentRoutes from './routes/Comments.js'
import AuthRoutes from './routes/Auth.js'
import cookieParser from 'cookie-parser'

import cors from 'cors'

dotenv.config()
const app = express()
const port = 3000

app.use(cors(
  {
    origin:["https://youtube-but-better-api.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }
))

//Connection to MongoDB
mongoose.connect(process.env.MONGO)
  .then((e) => { console.log("MongoDB connected") })
  .catch((err) => {
    throw err
  })

//Middlewares
app.use(express.json())
app.use(cookieParser())



app.use("/api/users", UserRoutes)
app.use("/api/videos", VideoRoutes)
app.use("/api/comments", CommentRoutes)
app.use("/api/auth", AuthRoutes)




//special use for catching errors
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 500
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})