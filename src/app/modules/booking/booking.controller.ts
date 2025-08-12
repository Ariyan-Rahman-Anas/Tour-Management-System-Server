import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { BookingService } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodedToken.userId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Booking Created!",
        data: booking
    })
})


const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {bookings, total, page, limit, totalPages} = await BookingService.getAllBookings(req.query as Record<string, string>)
    sendResponse(res, {
         statusCode: httpStatus.OK,
        success: true,
        message: "All Bookings Retrieved!",
        data: bookings,
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    })
})

export const BookingController = {
    createBooking,
    getAllBookings
}