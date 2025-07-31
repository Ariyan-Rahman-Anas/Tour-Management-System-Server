import { Types } from "mongoose"

export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED= "BLOCKED"
}

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
}