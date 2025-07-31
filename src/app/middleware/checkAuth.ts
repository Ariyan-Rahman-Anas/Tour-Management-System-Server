import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes"
import { verifyToken } from "../utils/jwtHelper";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuthorization = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw new AppError(httpStatus.FORBIDDEN, "Unauthenticated!")
        }

        const verifiedToken = verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET) as JwtPayload
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!")
        }
        req.user = verifiedToken
        next()
    } catch (error) {
        next(error)
    }
}