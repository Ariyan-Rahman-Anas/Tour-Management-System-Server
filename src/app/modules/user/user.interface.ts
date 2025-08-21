import { Types } from "mongoose"
import { IsActive, Role } from "../../constant"

export interface AuthProviderI {
    provider: "google" | "credentials"
    providerId: string
}

export interface UserI {
    _id?: Types.ObjectId
    name: string
    email: string
    password?: string
    phone?: string
    image?: string
    address?: string
    isDeleted?: boolean
    isActive?: IsActive
    isVerified?: boolean
    role: Role 
    auth: AuthProviderI[]
    booking?: Types.ObjectId[]
    guides?: Types.ObjectId[]
    createdAt?: Date
}