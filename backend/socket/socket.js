import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:3000',
     methods: ["GET", "POST"],
                credentials: true,
                transports: ['websocket', 'polling'],
        },
        allowEIO3: true
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