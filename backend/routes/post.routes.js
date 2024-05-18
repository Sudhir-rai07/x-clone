import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createPost, deletePost } from "../controllers/post.controller.js";

const router = Router()

router.post("/create", protectRoute, createPost)
router.delete("/delete/:id", protectRoute, deletePost)

export default router