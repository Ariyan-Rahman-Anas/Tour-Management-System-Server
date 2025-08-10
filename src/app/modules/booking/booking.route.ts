import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { BookingCreateZodSchema } from "./booking.validation";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";
import { BookingController } from "./booking.controller";

const router = Router()

router.post("/create", validateRequest(BookingCreateZodSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), BookingController.createBooking)

router.get("/", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN, Role.USER, Role.GUIDE), BookingController.getAllBookings)

export const BookingRoute = router