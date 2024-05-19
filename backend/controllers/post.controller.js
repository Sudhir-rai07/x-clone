import Post from "../models/post.model.js";
import { v2 as Cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!text && !img)
      return res.status(400).json({ error: "A post must have text or image" });

    if (img) {
      const cloudinaryResponse = await Cloudinary.uploader.upload(img);
      img = cloudinaryResponse.secure_url;
    }
    // TODO: Don't accept empty strings
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost?.save();

    res.status(200).json(newPost);
  } catch (error) {
    console.log("Error in createPost Controller ", error.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const deletePost = async (req, res) => {
  const userId = req.user._id;
  const { id: postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    if (post.user.toString() !== userId.toString())
      return res.status(400).json({ error: "You can't delete this post." });

    if (post.img) {
      const imageId = await post.img.split("/").pop().split(".")[0];
      await Cloudinary.uploader.destroy(imageId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    console.log("Error in deletePost controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!postId) return res.status(400).json({ error: "Post not found" });

    // Check if post is already liked by this user
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // unlike a post
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });

      res.status(200).json({ message: "You unliked this post" });
    } else {
      // Like a post
      post.likes.push(userId);
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      post.save();

      // send Notification
      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await newNotification.save();
      res.status(200).json({ message: "You liked this post" });
    }
  } catch (error) {
    console.log("Error in likePost controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  const userId = req.user._id;
  const { id: postId } = req.params;
  const { text } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    if (!text)
      return res.status(400).json({ error: "A comment must have text" });

    const commentPayload = {text,
      user: userId
    }

    post.comments.push(commentPayload)
   await post.save()

    res.status(200).json({message: "you commented on this post", post})
  } catch (error) {
    console.log("Error in CommentOnPost controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) =>{
      try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
          path: "user",
          select: '-password'
        }).populate({
          path:"comments.user",
          select: "-password"
        })

        res.status(200).json(posts)
      } catch (error) {
        console.log("Error in getAllPosts controller", error.message)
        res.status(500).json({error: "Internal server error"})
      }
}