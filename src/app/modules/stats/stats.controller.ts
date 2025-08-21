/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsService } from "./stats.service";



const userStats = catchAsync(async (req, res, next) => {
    const users = await StatsService.userStats()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Stats Retrieved!",
        data: users
    })
})


const tourStats = catchAsync(async (req, res, next) => {
    const tours = await StatsService.tourStats()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tours Stats Retrieved!",
        data: tours
    })
})

const bookingStats = catchAsync(async (req, res, next) => {
    const bookings = await StatsService.bookingStats()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking Stats Retrieved!",
        data: bookings
    })
})


const paymentStats = catchAsync(async (req, res, next) => {
    const bookings = await StatsService.paymentStats()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments Stats Retrieved!",
        data: bookings
    })
})


export const StatsController = {
    bookingStats,
    paymentStats,
    userStats,
    tourStats
}