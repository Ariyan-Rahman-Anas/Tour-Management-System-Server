import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { BookingCreateZodSchema } from "./booking.validation";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";
import { BookingController } from "./booking.controller";

const router = Router()

router.post("/create", validateRequest(BookingCreateZodSchema), checkAuthorization(...Object.values(Role)), BookingController.createBooking)

router.get("/", checkAuthorization(...Object.values(Role)), BookingController.getAllBookings)

export const BookingRoute = router