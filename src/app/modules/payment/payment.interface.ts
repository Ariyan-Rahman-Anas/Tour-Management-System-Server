/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { PAYMENT_STATUS } from "../../constant";

export interface PaymentI {
    booking: Types.ObjectId
    transactionId: string
    amount: number
    paymentGetWayData?: any
    invoiceUrl?: string
    status: PAYMENT_STATUS
}