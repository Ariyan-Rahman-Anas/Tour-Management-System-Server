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


const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.createTour(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour Created!",
        data: tour
    })
})


const getAllTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tours = await TourService.getAllTours()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Tours Retrieved!",
        data: tours,
        meta: {
            total: tours?.length
        }
    })
})


const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.updateTour(req.params.id, req.body)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour Updated!",
        data: tour
    })
})


const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.deleteTour(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour Deleted!",
        data: tour
    })
})



export const TourController = {
    CreateTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTours,
    updateTour,
    deleteTour
}