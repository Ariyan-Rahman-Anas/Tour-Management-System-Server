import crypto from "crypto"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"
import AppError from "../../errorHelpers/appError"
import httpStatus from "http-status-codes"
import { UserModel } from "../user/user.model"

const OTPExpiryTime = 5 * 60
const generateOTP = (length = 6) => {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
}

const sendOTP = async (email: string) => {
    const isUserExist = await UserModel.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }
    if(isUserExist.isVerified){
        throw new AppError(httpStatus.BAD_REQUEST, "User already verified!")
    }
    
    const otp = generateOTP()
    const redisKey = `otp:${email}`
    await redisClient.set(redisKey, otp,{
        expiration:{
            type: "EX",
            value: OTPExpiryTime
        }
    })

    await sendEmail({
        to: email,
        subject: "OTP Verification",
        templateName: "otpVerification",
        templateData: {
            name: "User",
            otp
        }
    })
}


const verifyOTP = async (email: string, otp: string) => {
    const isUserExist = await UserModel.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }
    if(isUserExist.isVerified){
        throw new AppError(httpStatus.BAD_REQUEST, "User already verified!")
    }
    const redisKey = `otp:${email}`
    const storedOTP = await redisClient.get(redisKey)
    if(storedOTP !== otp){
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP!")
    }

    await Promise.all([
        UserModel.updateOne({ email }, { isVerified: true }, {runValidators: true}),
        redisClient.del(redisKey)
    ])
}


export const OTPService = {
    sendOTP,
    verifyOTP
}