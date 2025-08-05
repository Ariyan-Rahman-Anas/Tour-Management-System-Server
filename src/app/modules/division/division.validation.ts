import z from "zod";

export const DivisionCreateSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Please enter division name" }),
    slug: z
        .string()
        .min(3, { message: "Division slug required" }),
    thumbnail: z
        .string()
        .min(3, { message: "Please attach the division's thumbnail"})
        .optional(),
    description: z.string()
        .min(3, { message: "Please enter description" })
        .optional()
})