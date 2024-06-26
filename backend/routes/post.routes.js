import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getPost, getUserPosts, likePost, } from "../controllers/post.controller.js";

const router = Router()

router.get('/all', protectRoute, getAllPosts)
router.get('/id/:postid', getPost)
router.post("/create", protectRoute, createPost)
router.delete("/delete/:id", protectRoute, deletePost)
router.put("/like/:id", protectRoute, likePost)
router.post('/comment/:id', protectRoute,commentOnPost)
router.get('/liked', protectRoute,getLikedPosts)
router.get('/following', protectRoute,getFollowingPosts)
router.get('/user/:username', protectRoute,getUserPosts)

export default router