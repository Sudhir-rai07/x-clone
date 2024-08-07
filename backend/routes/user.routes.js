import {Router} from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { followAndUnfollowUser, getAllUsers, getUserProfile, suggestUserProfile, updateProfile } from '../controllers/user.controller.js'

const router = Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.get("/suggested", protectRoute, suggestUserProfile)
router.post("/follow/:id", protectRoute, followAndUnfollowUser)
router.put("/update", protectRoute, updateProfile)
router.get("/all", protectRoute, getAllUsers)

export default router