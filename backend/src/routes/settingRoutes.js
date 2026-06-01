import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/", getSettings);
router.put("/", protect, admin, updateSettings);

export default router;
