import { Types } from "mongoose";
import { BOOKING_STATUS } from "../../constant";

export interface BookingI {
    user: Types.ObjectId
    tour: Types.ObjectId
    payment?: Types.ObjectId
    guestCount: number
    status: BOOKING_STATUS

}