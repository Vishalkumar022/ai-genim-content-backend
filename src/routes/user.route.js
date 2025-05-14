import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createAIResponse, getAIResponse } from "../controllers/aiResponse.controller.js";
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


// secure routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/profile").post(verifyJWT,  getUserProfile)
router.route("/create-ai-response").post(verifyJWT,createAIResponse)
router.route("/get-ai-response").get(verifyJWT,getAIResponse)
export default router