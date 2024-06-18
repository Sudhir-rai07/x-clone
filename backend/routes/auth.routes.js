import {Router} from 'express'
import { getMe, login, logout, signup, verifyUser } from '../controllers/auth.controller.js'
import protectRoute from '../middleware/protectRoute.js'

const router = Router()
router.get("/me",protectRoute, getMe)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/user/:id/verify/:token", verifyUser)



export default router