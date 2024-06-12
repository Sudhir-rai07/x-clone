import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";

export const feedback = async (req, res) =>{
    const userId = req.user._id
    const {text} = req.body
    try {
        const user = await User.findById(userId)
        if(!user) return res.status(400).json({error: "User not found"})

            if(!text) return res.status(400).json({error: "Feedback text is required"})
        const newFeedback =  new Feedback({
            user: userId,
            text
        })

        newFeedback.save()

        res.status(200).json(newFeedback)
    } catch (error) {
        console.log("Error in addFeedback controller", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}

export const allFeedbacks = async (req, res) =>{
    const userId = req.user._id

    try {
        const feedbacks = await Feedback.find().populate({
            path: "user",
            select: "-password"
        })

        res.status(200).json(feedbacks)
    } catch (error) {
        console.log("Error in all feedback controller", error.message)
        res.status(500).json({error: "Internal server error"}) 
    }
}