import { Router } from "express";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";
import { StatsController } from "./stats.controller";

const router = Router()

router.get("/users", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), StatsController.userStats)

router.get("/tours", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), StatsController.tourStats)

router.get("/bookings", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), StatsController.bookingStats)

router.get("/payments", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), StatsController.paymentStats)


export const StatsRoute = router 