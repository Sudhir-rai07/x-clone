import {Router} from 'express'
import { getMe, login, logout, signup } from '../controllers/auth.controller.js'

const router = Router()
router.get("/me", getMe)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)



export default router