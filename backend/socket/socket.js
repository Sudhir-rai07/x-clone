import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const origin = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://x-clone-xast.onrender.com"
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"]
    }
})


export const getReceiverSocketId = (receiverId) =>{
    return userSocketMap[receiverId]
}

let userSocketMap = {}

io.on('connection', (socket)=>{
    console.log("A user connected")
    const userId = socket.handshake.query.userId
    if(userId !== "undefined") userSocketMap[userId] = socket.id

    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', ()=>{
        console.log("User disconnected")
        delete userSocketMap[userId]
    })
})



export {app, io, server}