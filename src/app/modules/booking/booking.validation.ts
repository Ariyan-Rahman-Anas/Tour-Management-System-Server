import z from "zod";

export const BookingCreateZodSchema = z.object({
    user: z.string().min(3, { message: "Booking user info required!" }),
    tour: z.string().min(3, { message: "Booking tour info required!" }),
    payment: z.string().optional(),
    guestCount: z.number().min(1, { message: "At least 1 guest must be have" }),
})