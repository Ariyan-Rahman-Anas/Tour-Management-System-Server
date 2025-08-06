import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { TourService } from "./tour.service"
import httpStatus from "http-status-codes"

const CreateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.CreateTourType(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour Type Created!",
        data: tourType
    })
})

const getAllTourTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await TourService.getAllTourTypes()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Tour Types Retrieved!",
        data: tourTypes,
        meta: {
            total: tourTypes?.length
        }
    })
})

const updateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.updateTourType(req.params.id, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour Type Updated!",
        data: tourType
    })
})

const deleteTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.deleteTourType(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour Type Deleted!",
        data: tourType
    })
})


export const TourController = {
    CreateTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}