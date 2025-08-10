import { model, Schema } from "mongoose";
import { PaymentI } from "./payment.interface";
import { PAYMENT_STATUS } from "../../constant";

const paymentSchema = new Schema<PaymentI>({
    booking: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "booking",
        unique: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentGetWayData: {
        type: Schema.Types.Mixed``
    },
    invoiceUrl: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID
    }

}, { timestamps: true, versionKey: false })

export const PaymentModel = model<PaymentI>("payment", paymentSchema)