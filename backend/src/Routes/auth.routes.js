import express from "express";
import {
  changePassword,
  login,
  logout,
  onboard,
  resendOtp,
  singup,
  verifyEmail,
  verifyForgotEmail,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", resendOtp);
router.post("/forgot-password-verify", verifyForgotEmail);
router.put("/forgot-password-change", changePassword);

// for onboarding
router.post("/onboarding", protectRoute, onboard);

// checks user login or not
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
