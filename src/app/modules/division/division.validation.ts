import z from "zod";

export const DivisionCreateSchema = z.object({
    name: z
        .string()
    .min(3, {message:"Please enter division name"})

})