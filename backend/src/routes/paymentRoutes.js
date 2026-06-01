import { Router } from "express";
import {
  createPaymentIntent,
  markPaid,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/create-intent", protect, createPaymentIntent);
router.post("/:orderId/mark-paid", protect, markPaid);

export default router;
