import z from "zod";


export const TourTypeCreateSchema = z.object({
    name: z.string().min(3, { message: "Tour type name must be at least 3 characters long" })
})

export const TourTypeUpdateSchema = z.object({
    name: z.string().min(3, { message: "Tour type name must be at least 3 characters long" }).optional()
})

export const TourCreateZodSchema = z.object({
    title: z.string().min(3, { message: "Tour title must be at least 3 characters long" }),
    slug: z.string().min(3, { message: "Tour slug must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Tour description must be at least 3 characters long" }),
    images: z.array(z.string()).min(1, { message: "Tour images must be at least 1" }),
    location: z.string().min(3, { message: "Tour location must be at least 3 characters long" }),
    cost: z.number().min(1, { message: "Tour cost must be at least 1" }),
    startDate: z.string().min(3, { message: "Tour start date must be at least 3 characters long" }),
    endDate: z.string().min(3, { message: "Tour end date must be at least 3 characters long" }),
    included: z.array(z.string()).min(1, { message: "Tour included must be at least 1" }),
    excluded: z.array(z.string()).min(1, { message: "Tour excluded must be at least 1" }),
    amenities: z.array(z.string()).min(1, { message: "Tour amenities must be at least 1" }),
    tourPlan: z.string().min(3, { message: "Tour plan must be at least 3 characters long" }),
    maxGuest: z.number().min(1, { message: "Tour max guest must be at least 1" }),
    minAge: z.number().min(1, { message: "Tour min age must be at least 1" }),
    division: z.string().min(3, { message: "Tour division must be at least 3 characters long" }),
    tourType: z.string().min(3, { message: "Tour tour type must be at least 3 characters long" })
})

export const TourUpdateZodSchema = z.object({
    title: z.string().min(3, { message: "Tour title must be at least 3 characters long" }).optional(),
    slug: z.string().min(3, { message: "Tour slug must be at least 3 characters long" }).optional(),
    description: z.string().min(3, { message: "Tour description must be at least 3 characters long" }).optional(),
    images: z.array(z.string()).min(1, { message: "Tour images must be at least 1" }).optional(),
    location: z.string().min(3, { message: "Tour location must be at least 3 characters long" }).optional(),
    cost: z.number().min(1, { message: "Tour cost must be at least 1" }).optional(),
    startDate: z.string().min(3, { message: "Tour start date must be at least 3 characters long" }).optional(),
    endDate: z.string().min(3, { message: "Tour end date must be at least 3 characters long" }).optional(),
    included: z.array(z.string()).min(1, { message: "Tour included must be at least 1" }).optional(),
    excluded: z.array(z.string()).min(1, { message: "Tour excluded must be at least 1" }).optional(),
    amenities: z.array(z.string()).min(1, { message: "Tour amenities must be at least 1" }).optional(),
    tourPlan: z.string().min(3, { message: "Tour plan must be at least 3 characters long" }).optional(),
    maxGuest: z.number().min(1, { message: "Tour max guest must be at least 1" }).optional(),
    minAge: z.number().min(1, { message: "Tour min age must be at least 1" }).optional(),
    division: z.string().min(3, { message: "Tour division must be at least 3 characters long" }).optional(),
    tourType: z.string().min(3, { message: "Tour tour type must be at least 3 characters long" }).optional()
})