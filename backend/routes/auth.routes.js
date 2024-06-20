import {Router} from 'express'
import { forgetPassword, getMe, login, logout, resetPassword, signup, verifyUser } from '../controllers/auth.controller.js'
import protectRoute from '../middleware/protectRoute.js'

const router = Router()
router.get("/me",protectRoute, getMe)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.get("/user/:id/verify/:token", verifyUser)
router.post("/forget-password/", forgetPassword)
router.post("/reset-password/:token", resetPassword)



export default router