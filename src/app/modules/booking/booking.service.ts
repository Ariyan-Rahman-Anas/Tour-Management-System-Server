import { searchableFields } from "../../constant"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { BookingI } from "./booking.interface"
import { BookingModel } from "./booking.model"

const createBooking = async (payload: BookingI) => {
    const booking = await BookingModel.create(payload)
    return booking
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