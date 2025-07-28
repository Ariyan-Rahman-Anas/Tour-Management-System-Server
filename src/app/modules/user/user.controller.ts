import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created!",
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
    getAllUser
}