import z from "zod";
import { IsActive, Role } from "../../constant";

export const UserCreateZodSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),

    email: z.string()
        .email({ message: "Invalid email address" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(70, { message: "Email cannot exceed 70 characters" }),

    password: z.string()
        .min(5, { message: "Password must be at least 5 characters long" })
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/, {
            message: "Password must contain at least 1 uppercase letter, 1 special character, and 1 number",
        }),

    phone: z.string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be a valid Bangladeshi number",
        })
        .optional(),

    address: z.string()
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
});


export const UserUpdateZodSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }).optional(),
    phone: z.string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be a valid Bangladeshi number",
        })
        .optional().optional(),
    address: z.string()
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional().optional(),
    role: z
        .enum(Object.values(Role))
        .optional(),
    isActive: z
        .enum(Object.values(IsActive))
        .optional(),
    isDeleted: z
        .boolean({ message: "isDeleted must be true of false as boolean" })
        .optional(),
    isVerified: z
        .boolean({ message: "isVerified must be true or false as boolean" })
        .optional()
});