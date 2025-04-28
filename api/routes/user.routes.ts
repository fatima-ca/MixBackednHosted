import { Router } from "express";
import { jwtCheckFromCookie } from "../middleware/auth0";
import { UserHttpHandler } from "../handlers/user.handler";

const router = Router();
const handler = new UserHttpHandler();

router.post("/signup", handler.signup);
router.get("/profile", jwtCheckFromCookie, handler.getProfile);
router.get("/session", jwtCheckFromCookie, handler.sessionStatus.bind(handler));
router.post("/logout", handler.logout);
router.get("/email-status", jwtCheckFromCookie, handler.getEmailStatus.bind(handler));
router.post("/resend-verification", jwtCheckFromCookie, handler.resendVerificationEmail.bind(handler));
router.post("/forgot-password", handler.forgotPassword);
router.post("/upload-profile-pic", jwtCheckFromCookie, handler.uploadProfilePicture);

export default router;