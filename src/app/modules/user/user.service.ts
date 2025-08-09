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

    // const isUserExist = await UserModel.findOne({ email })
    // if (isUserExist) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User already exist!")
    // }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.HASHING_SALT) )

    const authProvider: AuthProviderI = { provider: "credentials", providerId: email as string }
    
    const user = await UserModel.create({
        email,
        password: hashedPassword,
        auth: [authProvider],
        ...rest,
    })
    return user
}


const updateUser = async (userId: string, decodedToken: JwtPayload, payload: Partial<UserI>) => {

    const isUserExist = await UserModel.findById(userId)
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!")
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

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.HASHING_SALT))
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    return updatedUser
}


const getAllUser = async () => {
    const users = await UserModel.find({})
    return users
}

export const UserService = {
    createUser,
    updateUser,
    getAllUser
}