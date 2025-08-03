/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthService } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utils/cookieSetter"
import { tokenProvider } from "../../utils/tokenProvider"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthService.credentialsLogin(req.body)
    setAuthCookie(res, loginInfo)
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged In!",
        data:loginInfo
    })
})


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "Unauthenticated!")
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string)
    
    setAuthCookie(res, tokenInfo)
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New Access Token Retrieved!",
        data:tokenInfo
    })
})


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged Out!",
        data: null
    })
})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body
    const decodedToken = req.user

    await AuthService.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload )
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed!",
        data: null
    })
})


const googleCallback = catchAsync(async (req: Request, res: Response, Next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }

    const tokenInfo = tokenProvider(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback
}