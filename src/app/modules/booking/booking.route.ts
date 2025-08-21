import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { BookingCreateZodSchema } from "./booking.validation";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";
import { BookingController } from "./booking.controller";

const router = Router()

router.post("/create", validateRequest(BookingCreateZodSchema), checkAuthorization(...Object.values(Role)), BookingController.createBooking)

router.get("/", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), BookingController.getAllBookings)

router.get("/:id", checkAuthorization(...Object.values(Role)), BookingController.getMyBookings)

export const BookingRoute = router