import z from "zod";

export const TourTypeCreateSchema = z.object({
    name: z.string().min(3, { message: "Tour type name must be at least 3 characters long" })
})

export const TourTypeUpdateSchema = z.object({
    name: z.string().min(3, { message: "Tour type name must be at least 3 characters long" }).optional()
})


const createTourZodSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    location: z.string().optional(),
    cost: z.number().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string(),
    tourType: z.string(),
    departure: z.string().optional(),
    arrival: z.string().optional()
  })
});

// Similar schema for update but with all fields optional
const updateTourZodSchema = createTourZodSchema.partial();

export const TourCreateZodSchema = createTourZodSchema;
export const TourUpdateZodSchema = updateTourZodSchema;