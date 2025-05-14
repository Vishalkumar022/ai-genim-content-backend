import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createSubscription, paymentSaved } from "../controllers/payment.controller.js";


const router = Router()



router.route("/create-subscription").post(verifyJWT,  createSubscription)
router.route("/save-payment").post(verifyJWT,  paymentSaved)
router.route("/save-payment").post(verifyJWT,  paymentSaved)


export default router