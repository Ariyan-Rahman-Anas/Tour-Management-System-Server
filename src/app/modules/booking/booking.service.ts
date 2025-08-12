import { BOOKING_STATUS, PAYMENT_STATUS, searchableFields } from "../../constant"
import AppError from "../../errorHelpers/appError"
import { generateUniqueId } from "../../utils/generateUniqueId"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { PaymentModel } from "../payment/payment.model"
import { TourModel } from "../tour/tour.model"
import { UserModel } from "../user/user.model"
import { BookingI } from "./booking.interface"
import { BookingModel } from "./booking.model"
import httpStatus from "http-status-codes"



const createBooking = async (payload: Partial<BookingI>, userId: string) => {
    // Input validation
    if (!payload.tour) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour ID is required!")
    }
    
    if (!payload.guestCount || payload.guestCount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Valid guest count is required!")
    }

    const session = await BookingModel.startSession()
    session.startTransaction()

    try {
        // Check user exists and has required info
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found!")
        }
        
        if (!user.phone || !user.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please update your account info to book a tour!")
        }

        // Check tour exists and get cost
        const tour = await TourModel.findById(payload.tour).select("cost")
        if (!tour) {
            throw new AppError(httpStatus.NOT_FOUND, "Tour not found!")
        }
        
        if (!tour.cost || tour.cost <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid tour cost!")
        }

        // Calculate total amount
        const totalAmount = tour.cost * payload.guestCount

        // Create booking - FIX: Handle array return properly
        const bookingResult = await BookingModel.create([{
            user: user._id,
            status: BOOKING_STATUS.PENDING,
            ...payload,
        }], { session })

        // Get the created booking (first element of array)
        const createdBooking = bookingResult[0]
        if (!createdBooking) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create booking!")
        }

        // Create payment
        const paymentResult = await PaymentModel.create([{
            booking: createdBooking._id,
            status: PAYMENT_STATUS.UNPAID,
            amount: totalAmount,
            transactionId: generateUniqueId("Tx")
        }], { session })

        const createdPayment = paymentResult[0]
        if (!createdPayment) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create payment!")
        }

        // Update booking with payment reference
        const updatedBooking = await BookingModel
            .findByIdAndUpdate(
                createdBooking._id,
                { payment: createdPayment._id },
                { new: true, runValidators: true, session }
            )
            .populate("user", "-password -createdAt -updatedAt")
            .populate("tour")
            .populate("payment")

        if (!updatedBooking) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update booking!")
        }

        await session.commitTransaction()
        session.endSession()
        
        return updatedBooking

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}




const getAllBookings = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(BookingModel.find(), query)
    const bookings = await queryBuilder
        .search(searchableFields)
        .filter()
        .sort()
        .select()
        .pagination()
        .populate("user")
        .populate("tour")
        .populate("payment")
        .build()

    const meta = await queryBuilder.getMeta()
    return {
        bookings,
        ...meta
    }
}

export const BookingService = {
    createBooking,
    getAllBookings
}