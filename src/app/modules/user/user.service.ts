import AppError from "../../errorHelpers/appError"
import { AuthProviderI, UserI } from "./user.interface"
import { UserModel } from "./user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import { Role } from "../../constant"


const createUser = async (payload: Partial<UserI>) => {
    const { email, password, ...rest } = payload

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.HASHING_SALT))

    const authProvider: AuthProviderI = { provider: "credentials", providerId: email as string }

    const user = await UserModel.create({
        email,
        password: hashedPassword,
        auth: [authProvider],
        ...rest,
    })
    return user
}


const getLoggedInUser = async (userId: string) => {
    const user = await UserModel.findById(userId).select("-password")
    return user
}


const getAllUser = async () => {
    const users = await UserModel.find({})
    return users
}


const updateUser = async (userId: string, decodedToken: JwtPayload, payload: Partial<UserI>) => {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!")
        }
    }

    const isUserExist = await UserModel.findById(userId)
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!")
    }

    if (decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!")
        }

        if (decodedToken.role === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!")
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!")
        }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    return updatedUser
}


const getUserById = async (id: string) => {
    const user = await UserModel.findById({_id: id }).select("-password")
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }
    return user
}

export const UserService = {
    createUser,
    getLoggedInUser,
    updateUser,
    getAllUser,
    getUserById
}