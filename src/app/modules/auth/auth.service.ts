/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError"
import { UserModel } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { createNewAccessTokenUsingRefreshToken } from "../../utils/tokenProvider"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import { AuthProviderI } from "../user/user.interface"



// no need this form now, because of credential login done with passport
// const credentialsLogin = async (payload: Partial<UserI>) => {
//     const { email, password } = payload

//     const isUserExist = await UserModel.findOne({ email })
//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!")
//     }

//     // Add this check before bcrypt.compare
//     if (!password) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Password is required!")
//     }
    
//     // Check if user has a password (wasn't created via social auth)
//     if (!isUserExist.password) {
//         throw new AppError(httpStatus.BAD_REQUEST, "This account was created using social login. Please use social authentication or reset your password.")
//     }

//     const isCorrectPassword = await bcrypt.compare(password as string, isUserExist.password as string)
//     if (!isCorrectPassword) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!")
//     }

//     const tokens = tokenProvider(isUserExist)

//     // Remove password before returning
//     const userObject = isUserExist.toObject()
//     delete userObject.password
//     return {
//         user: userObject,
//         accessToken: tokens.accessToken,
//         refreshToken: tokens.refreshToken 
//     }
// }


const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenUsingRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await UserModel.findById(decodedToken.userId)
    const isOldPasswordMatched = await bcrypt.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Old password not correct!")
    }
    user!.password = await bcrypt.hash(newPassword, Number(envVars.HASHING_SALT))
    user?.save()
}



const setPassword = async (userId: string, password: string) => {
    if(password.length < 5){
        throw new AppError(httpStatus.BAD_REQUEST, "Password must be at least 5 characters long!")
    }
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found!")
    }
    if(user.password && user.auth.some(i => i.provider === "google")){
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set your password. Please use reset password option from the profile page.")
    }
    const hashedPassword = await bcrypt.hash(password, Number(envVars.HASHING_SALT))
    const credentialProvider:AuthProviderI = { provider: "credentials", providerId: user.email }
    const auths:AuthProviderI[] = [...user.auth, credentialProvider]
    user.password = hashedPassword
    user.auth = auths
    await user.save()
}



export const AuthService = {
    getNewAccessToken,
    resetPassword,
    setPassword
}