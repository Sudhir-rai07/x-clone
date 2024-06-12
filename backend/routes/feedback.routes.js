import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { allFeedbacks, feedback } from "../controllers/feedback.controller.js";

const router = Router()

    router.post("/", protectRoute, feedback)
    router.get("/all", protectRoute, allFeedbacks)

export default router