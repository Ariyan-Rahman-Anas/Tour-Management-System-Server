import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { UserI } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwtHelper";
import { UserModel } from "../modules/user/user.model";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes"
import { IsActive } from "../constant";

export const tokenProvider = (user: Partial<UserI>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload, envVars.ACCESS_TOKEN_SECRET, envVars.ACCESS_TOKEN_EXPIRY)

    const refreshToken = generateToken(jwtPayload, envVars.REFRESH_TOKEN_SECRET, envVars.REFRESH_TOKEN_EXPIRY)

    return {
        accessToken, refreshToken
    }
}


export const createNewAccessTokenUsingRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET) as JwtPayload

    const isUserExist = await UserModel.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!")
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `Account ${isUserExist.isActive}!`)
    }

    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account Deleted!")
    }

    // const token = tokenProvider(isUserExist)
    // return token

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.ACCESS_TOKEN_SECRET, envVars.ACCESS_TOKEN_EXPIRY)
    return accessToken
}