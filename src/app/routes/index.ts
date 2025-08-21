import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoute } from "../modules/division/division.route";
import { TourRoute } from "../modules/tour/tour.route";
import { BookingRoute } from "../modules/booking/booking.route";
import { PaymentRoute } from "../modules/payment/payment.route";
import { OTPRoute } from "../modules/OTP/OTP.route";
import { StatsRoute } from "../modules/stats/stats.route";

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoute
    },
    {
        path: "/auth",
        route: AuthRoute
    },
    {
        path: "/division",
        route: DivisionRoute
    },
    {
        path: "/tour",
        route: TourRoute
    },
    {
        path: "/booking",
        route: BookingRoute
    },
    {
        path: "/payment",
        route: PaymentRoute
    },
    {
        path: "/otp",
        route: OTPRoute
    },
    {
        path: "/stats",
        route: StatsRoute
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})