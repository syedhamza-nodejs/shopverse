import { Router } from "express";
import {
  getProducts,
  getFeatured,
  getFilterMeta,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/", getProducts);
router.get("/featured", getFeatured);
router.get("/filters", getFilterMeta);
router.post("/", protect, admin, createProduct);
router.get("/:slug", getProductBySlug);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/:id/reviews", protect, createReview);

export default router;
