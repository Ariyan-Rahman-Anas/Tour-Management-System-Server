import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"

const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionService.createDivision(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Division Created!",
        data: division
    })
})

export const DivisionController = {
    createDivision
}