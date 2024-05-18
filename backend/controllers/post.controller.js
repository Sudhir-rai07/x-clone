import Post from "../models/post.model.js";
import { v2 as Cloudinary } from "cloudinary";
import User from "../models/user.model.js";

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
    if (!post) return res.status(400).josn({ error: "Post not found" });

    if (post.user.toString() !== userId.toString())
      return res.status(400).josn({ error: "You can't delete this post." });

    if (post.img) {
      const imageId = await post.img.split("/").pop().split(".")[0];
      await Cloudinary.uploader.destroy(imageId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    console.log("Error in deletePost controller", error.message)
    res.status(500).json({error: "Internal server error"})
  }
};
