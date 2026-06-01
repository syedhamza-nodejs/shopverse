import { Router } from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, admin, getDashboardStats);

export default router;
