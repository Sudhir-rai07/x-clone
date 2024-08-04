import Conversation from "../models/conversation.model.js"
import Message from '../models/message.model.js'
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
  const {message} = req.body
  const {_id: senderId} = req.user
  const {id: reciverId} = req.params

  try {

    let conversation = await Conversation.findOne({participants: {$all : [senderId, reciverId]}})
    if(!conversation) {
    conversation =  await Conversation.create({
        participants: [senderId, reciverId]
      })
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      message
    })

    conversation.messages.push(newMessage._id)
    await newMessage.save()
    await conversation.save()
    // Promise.all([conversation.save(), newMessage.save()])

    const receiverSocketId = getReceiverSocketId(reciverId)
    if(receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    res.status(200).json(newMessage)
    
  } catch (error) {
    console.log("Error in sendMessage controller : ", error.message)
    res.status(400).json({error: "Internal server error"})
  }
}


export const getMessages = async (req, res) =>{
    const {id: userToChatId} = req.params
    const {_id: senderId} = req.user

    try {
      const conversation = await Conversation.findOne({
        participants: {$all :[senderId, userToChatId]}
      }).populate("messages")

      if(!conversation) return res.status(200).json([])
        const messages = conversation.messages
      res.status(200).json(messages)
    } catch (error) {
      console.log("Error in getMessage controller : ", error.message)
      res.status(400).json({error: "Internal server error"})
    }
}