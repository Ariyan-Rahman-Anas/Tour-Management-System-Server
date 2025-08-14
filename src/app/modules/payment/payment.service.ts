import { BOOKING_STATUS, PAYMENT_STATUS } from "../../constant"
import AppError from "../../errorHelpers/appError"
import { BookingModel } from "../booking/booking.model"
import { PaymentModel } from "./payment.model"
import httpStatus from "http-status-codes"
import { SSLCommerzService } from "../sslCommerz/sslCommerz.service"
import { SSLCommerzII } from "../sslCommerz/sslCommerz.interface"


const previousPaymentInit = async (id: string) => {
    const payment = await PaymentModel.findOne({ booking: id })
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found!")
    }

    const booking = await BookingModel.findById(payment.booking)

    const sslPayload: SSLCommerzII = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: (booking?.user as any).name,
        email: (booking?.user as any).email,
        phoneNumber: (booking?.user as any).phone,
        address: (booking?.user as any).address,
    }

    const paymentInit = await SSLCommerzService.sslPaymentInit(sslPayload)

    return {
        // success: true,
        // message: "Payment Initiated for Previous Booking!",
        // data: paymentInit,
        paymentUrl: paymentInit?.GatewayPageURL
    }
}

const onSuccessPayment = async (query: Record<string, string>) => {
    const session = await BookingModel.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { new: true, runValidators: true, session })

        await BookingModel.findByIdAndUpdate(updatedPayment?.booking,
            { status: BOOKING_STATUS.COMPLETED },
            { new: true, runValidators: true, session })

        await session.commitTransaction()
        session.endSession()
        return {
            success: true,
            message: "Payment Successful!",
        }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const onFailPayment = async (query: Record<string, string>) => {
    const session = await BookingModel.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId },
            { status: PAYMENT_STATUS.FAILED },
            { new: true, runValidators: true, session })

        await BookingModel.findByIdAndUpdate(updatedPayment?.booking,
            { status: BOOKING_STATUS.FAILED },
            { new: true, runValidators: true, session })

        await session.commitTransaction()
        session.endSession()
        return {
            success: false,
            message: "Payment Failed!",
        }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const onCancelPayment = async (query: Record<string, string>) => {
    const session = await BookingModel.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId },
            { status: PAYMENT_STATUS.CANCELED },
            { new: true, runValidators: true, session })

        await BookingModel.findByIdAndUpdate(updatedPayment?.booking,
            { status: BOOKING_STATUS.CANCELED },
            { new: true, runValidators: true, session })

        await session.commitTransaction()
        session.endSession()
        return {
            success: false,
            message: "Payment Canceled!",
        }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export const PaymentService = {
    previousPaymentInit,
    onSuccessPayment,
    onFailPayment,
    onCancelPayment
}