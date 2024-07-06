import bcrypt from "bcryptjs";
import { v2 as Cloudinary } from "cloudinary";
// Models
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .select("-password")
      .populate({
        path: "followers",
        select: "-password",
      })
      .populate({
        path: "following",
        select: "-password",
      });
    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.satus(500).json({ error: error.message });
    console.log("An error occured in getUserProfile contoller ", error.message);
  }
};

export const suggestUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestUsers = filteredUsers.slice(0, 4);

    suggestUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(
      "An error occured in suggestUserProfile contoller ",
      error.message
    );
  }
};

export const followAndUnfollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === currentUser._id.toString())
      return res
        .status(200)
        .json({ error: "You can't follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(200).json({ error: "User not found" });
    const isFollowing = await currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      // response
      res
        .status(200)
        .json({ message: `you unfollowed ${userToModify?.username}` });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // send notification
      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "follow",
      });

      await newNotification.save();
      // response
      res
        .status(200)
        .json({ message: `Started following ${userToModify?.username}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(
      "An error occured in followAndUnfollow contoller ",
      error.message
    );
  }
};

export const updateProfile = async (req, res) => {
  const { username, fullName, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  try {
    const userId = req.user._id;
    let user = await User.findById(userId);

    // Check if username is already Taken while updating username
    const usernameExistsAlready = await User.findOne({ username });
    if (usernameExistsAlready)
      return res.status(400).json({ error: "This username is already taken." });

    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Please provide both current and new password" });
    }

    if (currentPassword && newPassword) {
      const isCorrectPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCorrectPassword)
        return res
          .status(400)
          .json({ error: "Current password is incorrenct" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await Cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const cloudinaryUploadResponsse = await Cloudinary.uploader.upload(
        profileImg
      );
      profileImg = cloudinaryUploadResponsse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await Cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const cloudinaryUploadResponsse = await Cloudinary.uploader.upload(
        coverImg
      );
      coverImg = cloudinaryUploadResponsse.secure_url;
    }

    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.link = link || user.link;
    user.bio = bio || user.bio;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();

    user.password = "";

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("An error occured in upadateProfile contoller ", error.message);
  }
};
