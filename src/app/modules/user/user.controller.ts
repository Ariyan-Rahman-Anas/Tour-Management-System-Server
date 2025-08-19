/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
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


const getLoggedInUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const user = await UserService.getLoggedInUser(decodedToken.userId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created!",
        data: user
    })
})


const UpdateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const verifiedToken = req.user
    const payload = req.body

    const user = await UserService.updateUser(userId, verifiedToken as JwtPayload, payload)
    sendResponse(res, {
        statusCode: httpStatus.OK,
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


const getUserById = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const user = await UserService.getUserById(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Retrieved!",
        data: user
    })
})


export const UserController = {
    createUser,
    getLoggedInUser,
    UpdateUser,
    getAllUser,
    getUserById
}