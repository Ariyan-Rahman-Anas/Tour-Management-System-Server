import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router()

router.post("/success", PaymentController.onSuccessPayment)
router.post("/fail", PaymentController.onFailPayment)
router.post("/cancel", PaymentController.onCancelPayment)

export const PaymentRoute = router