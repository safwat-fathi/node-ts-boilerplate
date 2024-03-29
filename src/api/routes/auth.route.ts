import { Router } from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  verification,
} from "@/api/controllers/auth.controller";
import {
  validateEmail,
  validateName,
  validatePasswordMatch,
  validatePhone,
  validatePassword,
  checkDuplicate,
  verifyToken,
  required,
} from "@/api/middlewares/auth.middleware";
import { body, check } from "express-validator";

const auth = Router();

// * SIGNUP
auth.post(
  "/signup",
  checkDuplicate,
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhone,
  signup
);
// * LOGIN
auth.post(
  "/login",
  validateEmail,
  body("password")
    .exists()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Invalid password"),
  login
);
// * LOGOUT
auth.get("/logout", logout);
// * FORGOT PASSWORD
auth.post("/forgot-password", forgotPassword);
// * VERIFICATION
auth.get("/verification/", verification); // verification is done by sending email containing URL with token as a param when redirecting to front that uses this param to send it back to BE

export default auth;
