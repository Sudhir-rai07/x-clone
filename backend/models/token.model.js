import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    token: {
        type: String,
        default: ""
    },
    expireAt:{
        type: Date, 
        default: Date.now(),
        index: {expires: 3600000}
    }
})

const Token = mongoose.model("Token", tokenSchema)

export default Token;