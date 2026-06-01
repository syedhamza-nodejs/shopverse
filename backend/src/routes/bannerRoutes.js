import { Router } from "express";
import {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/", getBanners);
router.get("/all", protect, admin, getAllBanners);
router.post("/", protect, admin, createBanner);
router.put("/:id", protect, admin, updateBanner);
router.delete("/:id", protect, admin, deleteBanner);

export default router;
