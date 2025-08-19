/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError"
import { UserModel } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { createNewAccessTokenUsingRefreshToken } from "../../utils/tokenProvider"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"
import { AuthProviderI } from "../user/user.interface"
import { IsActive } from "../../constant"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail"



const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenUsingRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}


const setPassword = async (userId: string, password: string) => {
    if (password?.length < 5) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password must be at least 5 characters long!")
    }
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found!")
    }
    if (user.password && user.auth.some(i => i.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set your password. Please use reset password option from the profile page.")
    }
    const hashedPassword = await bcrypt.hash(password, Number(envVars.HASHING_SALT))
    const credentialProvider: AuthProviderI = { provider: "credentials", providerId: user.email }
    const auths: AuthProviderI[] = [...user.auth, credentialProvider]
    user.password = hashedPassword
    user.auth = auths
    await user.save()
}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    if(newPassword?.length < 5){
        throw new AppError(httpStatus.BAD_REQUEST, "Password must be at least 5 characters long!")
    }
    if (oldPassword === newPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "New password should not be same as old password!")
    }
    const user = await UserModel.findById(decodedToken.userId)
    const isOldPasswordMatched = await bcrypt.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Old password not correct!")
    }
    user!.password = await bcrypt.hash(newPassword, Number(envVars.HASHING_SALT))
    user?.save()
}


const forgotPassword = async (email: string) => {
    const user = await UserModel.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found!")
    }

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!")
    }
    if (!user.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Not Verified!")
    }
    if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `Account ${user.isActive}!`)
    }
    if (user.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted!")
    }

    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: "10m" })
    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`

    await sendEmail({
        to: user.email,
        subject: "Reset Password",
        templateName: "forgotPassword",
        templateData: {
            name: user.name,
            resetPasswordUrl: resetUILink
        }
    })
}


const changePassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if(payload.id !== decodedToken.userId){
        throw new AppError(httpStatus.BAD_REQUEST, "Unauthorized Action!")
    }
    if(payload.password.length < 5){
        throw new AppError(httpStatus.BAD_REQUEST, "Password must be at least 5 characters long!")
    }
    const user = await UserModel.findById(decodedToken.userId)
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found!")
    }
    user.password = await bcrypt.hash(payload.password, Number(envVars.HASHING_SALT))
    await user.save()
}

export const AuthService = {
    getNewAccessToken,
    resetPassword,
    setPassword,
    forgotPassword,
    changePassword
}