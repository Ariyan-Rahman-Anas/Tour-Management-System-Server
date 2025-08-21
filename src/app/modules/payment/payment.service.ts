/* eslint-disable @typescript-eslint/no-explicit-any */
import { BOOKING_STATUS, PAYMENT_STATUS } from "../../constant"
import AppError from "../../errorHelpers/appError"
import { BookingModel } from "../booking/booking.model"
import { PaymentModel } from "./payment.model"
import httpStatus from "http-status-codes"
import { SSLCommerzService } from "../sslCommerz/sslCommerz.service"
import { SSLCommerzII } from "../sslCommerz/sslCommerz.interface"
import { generatePDFInvoice, InvoiceDataI } from "../../utils/invoice"
import { TourI } from "../tour/tour.interface"
import { UserI } from "../user/user.interface"
import { sendEmail } from "../../utils/sendEmail"
import { cloudinaryUtils } from "../../config/cloudinary.config"

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
        paymentUrl: paymentInit?.GatewayPageURL
    }
}


const getInvoice = async (id: string) => {
    const payment = await PaymentModel.findById({ _id: id })
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Invoice not found!")
    }
    return {
        invoice: payment.invoiceUrl
    }
}



const onSuccessPayment = async (query: Record<string, string>) => {
    const session = await BookingModel.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { new: true, runValidators: true, session })

        const updatedBooking = await BookingModel.findByIdAndUpdate(updatedPayment?.booking,
            { status: BOOKING_STATUS.COMPLETED },
            { new: true, runValidators: true, session }).populate("tour", "title").populate("user")


        const invoiceData: InvoiceDataI = {
            bookingDate: updatedBooking?.createdAt as Date,
            guestCount: updatedBooking?.guestCount as number,
            totalAmount: updatedPayment?.amount as number,
            tourName: (updatedBooking?.tour as unknown as TourI)?.title,
            recieverName: (updatedBooking?.user as unknown as UserI).name,
            transactionId: updatedPayment?.transactionId as string,
        }

        const pdfBuffer = await generatePDFInvoice(invoiceData)
        const cloudinaryResult = await cloudinaryUtils.uploadBuffer(pdfBuffer, "Invoice")
        await PaymentModel.findByIdAndUpdate(updatedPayment?._id, {invoiceUrl: cloudinaryResult?.secure_url}, {runValidators: true, session})
        
        await sendEmail({
            to: (updatedBooking?.user as unknown as UserI).email,
            subject: "Booking Invoice",
            templateName: "bookingInvoice",
            templateData: {
                bookingDate: updatedBooking?.createdAt?.toISOString() as string,
                tourName: (updatedBooking?.tour as unknown as TourI)?.title,
                guestCount: (updatedBooking?.guestCount as number).toString(),
                totalAmount: (updatedPayment?.amount as number).toString(),
                transactionId: updatedPayment?.transactionId as string,
                recieverName: (updatedBooking?.user as unknown as UserI).name,
            },
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer as unknown as string,
                    contentType: "application/pdf"
                }
            ]
        })

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
    getInvoice,
    onSuccessPayment,
    onFailPayment,
    onCancelPayment
}