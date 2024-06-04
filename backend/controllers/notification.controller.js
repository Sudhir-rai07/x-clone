import Notification from "../models/notification.model.js"

export const getNotifications = async (req, res) =>{
    const userId = req.user._id

    try {
        const notifications = await Notification.find({to: userId}).populate({
            path: 'to',
            select: "-password"
        }).populate({
            path:"from",
            select: "-password"
        })
        .sort({
            createdAt: -1
        })
        await Notification.updateMany({to: userId}, {read: true})
        if(notifications.length === 0) 
           return res.status(200).json(notifications)

        res.status(200).json(notifications)
    } catch (error) {
     console.log("Error in getNotifications controller ", error.message)
     res.status(500).json({error: "Internal server error"})   
    }
}


export const deleteNotifications = async (req, res) =>{
    const userId = req.user._id

     try {
        await Notification.deleteMany({to: userId})
        res.status(200).json({message : "Deleted all notifications"})
        
     }catch (error) {
        console.log("Error in deleteNotifications controller ", error.message)
        res.status(500).json({error: "Internal server error"})   
       }
}