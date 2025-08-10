import { model, Schema } from "mongoose";
import { BookingI } from "./booking.interface";
import { BOOKING_STATUS } from "../../constant";

const bookingSchema = new Schema<BookingI>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    tour: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"tour"
    },
     payment: {
        type: Schema.Types.ObjectId,
        ref:"payment"
    },
    guestCount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(BOOKING_STATUS),
        default: BOOKING_STATUS.PENDING
    }
}, { timestamps: true, versionKey: false })

export const BookingModel = model<BookingI>("booking", bookingSchema)