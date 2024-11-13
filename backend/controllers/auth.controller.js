import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import Token from "../models/token.model.js";
import crypto from "crypto";
import transporter from "../utils/sendMail.js";

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
        tokenType: "user-verification"
      });
      await token.save();

      // mail options
      const mailOptions = {
        from: "connectplus@gmail.com",
        to: email,
        subject: "Account verification",
        text: `Hello, please verify your account by clicking this link below. ${
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://x-clone-xast.onrender.com"
        }/verify/user/${newUser._id}/${token.token}`,
      };
      const info = transporter.sendMail(mailOptions);
      console.log(info);
      if (!newUser.isVerified) {
        return res.status(200).json({
          message: "A verification link has been sent to your email",
        });
      }
      await generateTokenAndSetCookie(newUser._id, res);
      res.status(200).json({ message: "User created" });
      // res.status(200).json({
      //   username: newUser.username,
      //   fullName: newUser.fullName,
      //   email: newUser.email,
      //   followers: newUser.followers,
      //   following: newUser.following,
      //   profileImg: newUser.profileImg,
      //   coverImg: newUser.coverImg,
      //   bio: newUser.bio,
      //   link: newUser.link,
      //   likedPosts: newUser.likedPosts,
      // });
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

    const user = await User.findOne({ $or:[{username:username}, {email: username}]});
    if (!user) return res.status(400).json({ error: "User not found" });
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!isPasswordValid)
      return res.status(400).json({ error: "Incorrect username or password" });

    // Verificaition token
    const token = new Token({
      user_id: user._id,
      token: crypto.randomBytes(16).toString("hex"),
      tokenType: "user-verification"
    });

    await token.save();
    const mailOptions = {
      from: "connectplus@gmail.com",
      to: user.email,
      subject: "Account verification",
      text: `Hello, please verify your account by clicking this link below. ${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://x-clone-xast.onrender.com"
      }/verify/user/${user._id}/${token.token}`,
    };
    if (!user.isVerified) {
      const info = transporter.sendMail(mailOptions);
      console.log(info);
      return res.status(400).json({
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

    if (user.isVerified)
      return res
        .status(200)
        .json({ message: "Already verified.\n Please login", success: true });

    const token = await Token.findOne({ token: verifyToken });
    if (!token)
      return res.status(400).json({ error: "token not found", success: false });
    if(token.tokenType !== "user-verification") return res.status(400).json({error: "Invalid token"})

    await User.findByIdAndUpdate(userId, { isVerified: true });
    await Token.findOneAndUpdate({ token: verifyToken }, { token: null });
    return res
      .status(200)
      .json({ message: "User varified successfully", success: true });
  } catch (error) {
    console.log("Error in verifyUser controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgetPassword = async (req, res) => {
  const { text } = req.body;
  try {
    if (!text) return res.status(400).json({ error: "username is required" });
    
    const user = await User.findOne({ $or: [ { username: text }, { email: text } ] });
    if (!user) return res.status(400).json({ error: "User not found" });

    const passwordResetToken = crypto.randomBytes(16).toString("hex");
    const newToken = new Token({
      user_id: user._id,
      token: passwordResetToken,
      tokenType: "password-reset"
    });
    await newToken.save();

    const mailOptions = {
      to: user.email,
      from: process.env.NODEMAILER_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    ${
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://x-clone-xast.onrender.com"
    }/reset-password/${newToken.token},
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    const info =  transporter.sendMail(mailOptions);
    console.log(info);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("error in forgetPasswordController", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token: passwordResetToken } = req.params;
  const { password } = req.body;
  try {

    if(!passwordResetToken) return res.status(400).json({error: "Token not found"})
    const token = await Token.findOne({ token: passwordResetToken });
    if (!token) return res.status(400).json({ error: "Invalid token" });

    if(token.tokenType !== "password-reset") return res.status(400).json({error: "Invalid token"})

    const user = await User.findById(token.user_id);
    if (!user) return res.status(400).json({ error: "User not found" });

    // Check password is available
    if (!password)
      return res.status(400).json({ error: "New password is required" });

    // Check if oldPassword and password are same
    const isOldPassword = await bcrypt.compare(password, user.password)
    if(isOldPassword) return res.status(400).json({error: "New password can't be same as old password"})

      // Check password length 
    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be atleast 6 characters long." });

        // Hash password
    const newHashsedPassword = await bcrypt.hash(password, 10);
    user.password = newHashsedPassword;

    // Set token to null after password update
    token.token = null;
    Promise.all([user.save(), token.save()]);
    res.status(200).json({ message: "Password has been reset." });
  } catch (error) {
    console.log("Error in restPassword controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
