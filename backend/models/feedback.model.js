import mongoose from "mongoose";

const feedback_Schema = new mongoose.Schema({
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  text: {
    type: String,
    require: true,
  },
}, {timestamps: true});


const Feedback = mongoose.model("Feedback", feedback_Schema)

export default Feedback