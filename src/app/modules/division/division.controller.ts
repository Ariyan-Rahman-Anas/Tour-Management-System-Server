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

const getAllDivisions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisions = await DivisionService.getAllDivisions()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Divisions Retrieved!",
        data: divisions
    })
})



const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionService.updateDivision(req.params.id, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Division Updated!",
        data: division
    })
})


const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionService.deleteDivision(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Division Deleted!",
        data: division
    })
})


export const DivisionController = {
    createDivision,
    getAllDivisions,
    updateDivision,
    deleteDivision
}