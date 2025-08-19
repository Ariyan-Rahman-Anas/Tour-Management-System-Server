import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";

const router = Router()

router.post("/success", PaymentController.onSuccessPayment)
router.post("/fail", PaymentController.onFailPayment)
router.post("/cancel", PaymentController.onCancelPayment)
router.post("/payment-init/:id", PaymentController.previousPaymentInit)
router.get("/invoice/:id", checkAuthorization(...Object.values(Role)), PaymentController.getInvoice)

export const PaymentRoute = router