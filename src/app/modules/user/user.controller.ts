import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwtHelper";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created!",
        data: user
    })
})


const UpdateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const payload = req.body
    const token = req.headers.authorization
    const verifiedToken = verifyToken(token as string, envVars.JWT_SECRET) as JwtPayload

    const user = await UserService.updateUser(userId, payload, verifiedToken)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Updated!",
        data: user
    })
})


const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUser()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All User Retrieved!",
        data: users,
        meta: {
            total: users?.length
        }
    })
})

export const UserController = {
    createUser,
    UpdateUser,
    getAllUser
}