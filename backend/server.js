import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import {v2 as Cloudinary} from 'cloudinary'
import cookieParser from 'cookie-parser'
import connectToDB from './db/connectToMongoDB.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

app.use(express.json({limit: "5mb"}))
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
import feedbackRoutes from './routes/feedback.routes.js'
import messageRoute from './routes/message.routes.js'
import { app, server, io } from './socket/socket.js'

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/feedback", feedbackRoutes)
// Message
app.use("/api/message", messageRoute)


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.get("/", (req, res)=>{
    res.json({hello: "Working nice"})
})


server.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`)
    connectToDB()
})