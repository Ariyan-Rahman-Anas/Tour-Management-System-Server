import { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router()

router.post("/success", PaymentController.onSuccessPayment)
router.post("/fail", PaymentController.onFailPayment)
router.post("/cancel", PaymentController.onCancelPayment)
router.post("/payment-init/:id", PaymentController.previousPaymentInit)

export const PaymentRoute = router