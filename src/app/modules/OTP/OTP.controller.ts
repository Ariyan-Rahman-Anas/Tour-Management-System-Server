import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { OTPService } from "./OTP.service"


const sendOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await OTPService.sendOTP(req.body.email)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "OTP Sent!",
        data: null
    })
})


const verifyOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await OTPService.verifyOTP(req.body.email, req.body.otp)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "OTP Verified!",
        data: null
    })
})


export const OTPController = {
    sendOTP,
    verifyOTP
}