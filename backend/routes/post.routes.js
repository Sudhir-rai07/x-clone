import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, likePost, } from "../controllers/post.controller.js";

const router = Router()

router.get('/all', protectRoute, getAllPosts)
router.post("/create", protectRoute, createPost)
router.delete("/delete/:id", protectRoute, deletePost)
router.post("/like/:id", protectRoute, likePost)
router.post('/comment/:id', protectRoute,commentOnPost)

export default router