import { Router } from "express";
import { OTPController } from "./OTP.controller";

const router = Router()

router.post("/send", OTPController.sendOTP)
router.post("/verify", OTPController.verifyOTP)


export const OTPRoute = router