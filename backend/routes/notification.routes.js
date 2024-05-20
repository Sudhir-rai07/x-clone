import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const router = Router()

router.get("/all", protectRoute, getNotifications)
router.get("/delete", protectRoute, deleteNotifications)
export default router