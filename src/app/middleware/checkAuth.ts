import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes"
import { verifyToken } from "../utils/jwtHelper";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../modules/user/user.model";
import { IsActive } from "../constant";

export const checkAuthorization = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw new AppError(httpStatus.FORBIDDEN, "Unauthenticated!")
        }

        const verifiedToken = verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET) as JwtPayload

        const isUserExist = await UserModel.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!")
        }
        if(!isUserExist.isVerified){
            throw new AppError(httpStatus.BAD_REQUEST, "Account Not Verified!")
        }
        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `Account ${isUserExist.isActive}!`)
        }
        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "Account Deleted!")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!")
        }
        req.user = verifiedToken
        next()
    } catch (error) {
        next(error)
    }
}