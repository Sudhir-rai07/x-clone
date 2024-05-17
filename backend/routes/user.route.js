import {Router} from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { followAndUnfollowUser, getUserProfile, suggestUserProfile } from '../controllers/user.controller.js'

const router = Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.get("/suggested", protectRoute, suggestUserProfile)
router.post("/follow/:id", protectRoute, followAndUnfollowUser)

export default router