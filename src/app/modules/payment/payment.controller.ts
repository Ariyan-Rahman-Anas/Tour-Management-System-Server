import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";

export const onSuccessPayment = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await PaymentService.onSuccessPayment(req.query as Record<string, string>)
    if(result.success){
       res.redirect(envVars.SSL.SSL_SUCCESS_FRONTEND_URL)
    }

})


export const onFailPayment = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{

})


export const onCancelPayment = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{

})


export const PaymentController = {
    onSuccessPayment,
    onFailPayment,
    onCancelPayment
}