import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthService } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utils/cookieSetter"

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

    await AuthService.resetPassword(oldPassword, newPassword, decodedToken )
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed!",
        data: null
    })
})


export const AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
}