import dotenv from 'dotenv'
import express from 'express'
import {v2 as Cloudinary} from 'cloudinary'
import cookieParser from 'cookie-parser'
import connectToDB from './db/connectToMongoDB.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// Cloudinary config
Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)

app.get("/", (req, res)=>{
    res.json({hello: "Working nice"})
})


app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`)
    connectToDB()
})