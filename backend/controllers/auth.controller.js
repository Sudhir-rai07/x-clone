import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import Token from "../models/token.model.js";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "This username is already taken" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ error: "This email already exists" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();

      // Verificaition token
      const token = new Token({
        user_id: newUser._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      await token.save()
      await sendMail(email, newUser._id, token.token);
      if (!newUser.isVerified) {
        return res
          .status(400)
          .json({
            error: "A verification link has been sent to your email",
          });
      }
      await generateTokenAndSetCookie(newUser._id, res);

      res.status(200).json({
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        link: newUser.link,
        likedPosts: newUser.likedPosts,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({error: "User not found"})
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if ( !isPasswordValid)
      return res.status(400).json({ error: "Incorrect username or password" });

    // Verificaition token
    const token = new Token({
      user_id: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save()
    if (!user.isVerified) {
     await sendMail(user.email, user._id, token.token);
      return res
        .status(400)
        .json({
          error:
            "User not varified. A link has been sent to you email for verification",
        });
    }

    await generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Logged in",
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
      likedPosts: user.likedPosts,
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getme controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyUser = async (req, res) => {
  const { id: userId, token: verifyToken } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if(user.isVerified) return res.status(200).json({message: "Already verified.\n Please login", success: true})

    const token = await Token.findOne({token: verifyToken})
    if (!token) return res.status(400).json({ error: "token not found", success:false });

    await User.findByIdAndUpdate(userId, { isVerified: true });
    await Token.findOneAndUpdate({ token: verifyToken }, { token: null });
    return res.status(200).json({ message: "User varified successfully", success:true});
  } catch (error) {
    console.log("Error in verifyUser controller", error);
  }
};
