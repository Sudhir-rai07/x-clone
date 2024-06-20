import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    likedPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] },
    ],
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// userSchema.pre("save", async function(next){
//   if(!this.isModified("password")) return next()

//   const salt = bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   console.log("Error is here")
//   next()
// })

const User = mongoose.model("User", userSchema)
export default User