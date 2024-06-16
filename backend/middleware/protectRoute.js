import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res.status(400).json({ error: "Unauthorised - Token not found" });

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken)
      return res
        .status(400)
        .json({ error: "Unauthorised - provide a valid token" });

    const user = await User.findById(verifyToken.userId).select("-password")
    if (!user) return res.status(400).json({ error: "Can't find user!" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    console.log("Error in protectRouteMiddleware ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export default protectRoute