import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { AuthService } from "./auth.service"
import AppError from "../../errorHelpers/appError"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthService.credentialsLogin(req.body)
    res.cookie("accessToken", loginInfo.accessToken, {
        httpOnly: true,
        secure: false
    })
    res.cookie("refreshToken", loginInfo.refreshToken, {
        httpOnly: true,
        secure: false
    })
    
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
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged In!",
        data:tokenInfo
    })
})


export const AuthController = {
    credentialsLogin,
    getNewAccessToken
}