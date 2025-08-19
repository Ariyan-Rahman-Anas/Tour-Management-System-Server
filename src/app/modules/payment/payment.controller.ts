import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"


const previousPaymentInit = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await PaymentService.previousPaymentInit(req.params.id)
   sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment Initiated for Previous Booking!",
        data: result
    })
})

const onSuccessPayment = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await PaymentService.onSuccessPayment(req.query as Record<string, string>)
    if(result.success){
       res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${result.message}&amount=${req.query.amount}&status=${req.query.status }`)
    }
})

const onFailPayment = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await PaymentService.onFailPayment(req.query as Record<string, string>)
    if(!result.success){
       res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${result.message}&amount=${req.query.amount}&status=${req.query.status }`)
    }
})

const onCancelPayment = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await PaymentService.onCancelPayment(req.query as Record<string, string>)
    if(!result.success){
       res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${req.query.transactionId}&message=${result.message}&amount=${req.query.amount}&status=${req.query.status }`)
    }
})


export const getInvoice = catchAsync(async (req, res, next) => {
    const invoice = await PaymentService.getInvoice(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Invoice URL Retrieved!",
        data: invoice
    })
})


export const PaymentController = {
    previousPaymentInit,
    getInvoice,
    onSuccessPayment,
    onFailPayment,
    onCancelPayment,
}