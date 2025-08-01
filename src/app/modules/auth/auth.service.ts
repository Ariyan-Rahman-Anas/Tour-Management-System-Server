import AppError from "../../errorHelpers/appError"
import { UserModel } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { createNewAccessTokenUsingRefreshToken, tokenProvider } from "../../utils/tokenProvider"
import { UserI } from "../user/user.interface"


const credentialsLogin = async (payload: Partial<UserI>) => {
    const { email, password } = payload

    const isUserExist = await UserModel.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!")
    }

    // Add this check before bcrypt.compare
    if (!password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is required!")
    }
    
    // Check if user has a password (wasn't created via social auth)
    if (!isUserExist.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "This account was created using social login. Please use social authentication or reset your password.")
    }

    const isCorrectPassword = await bcrypt.compare(password as string, isUserExist.password as string)
    if (!isCorrectPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!")
    }

    const tokens = tokenProvider(isUserExist)

    // Remove password before returning
    const userObject = isUserExist.toObject()
    delete userObject.password
    return {
        user: userObject,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken 
    }
}



const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenUsingRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}



export const AuthService = {
    credentialsLogin,
    getNewAccessToken
}