import { BOOKING_STATUS, PAYMENT_STATUS } from "../../constant"
import { BookingModel } from "../booking/booking.model"
import { PaymentModel } from "./payment.model"

const onSuccessPayment = async (query: Record<string, string>) => {
    const session = await BookingModel.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId },
            {status: PAYMENT_STATUS.PAID},
            { new: true, runValidators: true, session })

        await BookingModel.findByIdAndUpdate(updatedPayment?.booking,
            {status: BOOKING_STATUS.COMPLETED},
            {new: true, runValidators: true, session })
            .populate("user", "-password -createdAt -updatedAt")
            .populate("tour")
            .populate("payment")

        await session.commitTransaction()
        session.endSession()
        return {
            success: true,
            message: "Payment successful!",
        }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

const onFailPayment = async () => {

}

const onCancelPayment = async () => {

}

export const PaymentService = {
    onSuccessPayment,
    onFailPayment,
    onCancelPayment
}