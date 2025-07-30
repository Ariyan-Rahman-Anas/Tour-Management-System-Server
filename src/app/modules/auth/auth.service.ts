import AppError from "../../errorHelpers/appError"
import { UserI } from "../user/user.interface"
import { UserModel } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env"
import { generateToken } from "../../utils/jwtHelper"

const credentialsLogin = async (payload: Partial<UserI>) => {
    const { email, password } = payload

    const isUserExist = await UserModel.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!")
    }

    const isCorrectPassword = await bcrypt.compare(password as string, isUserExist.password as string)
    if (!isCorrectPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.ACCESS_TOKEN_EXPIRY)

    // Remove password before returning
    const userObject = isUserExist.toObject()
    delete userObject.password
    return {
        user: userObject,
        accessToken
    }
}

export const AuthService = {
    credentialsLogin
}