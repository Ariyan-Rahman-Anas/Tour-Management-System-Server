/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Express } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { TourService } from "./tour.service"
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/appError"


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

// === tour type end ===

// const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     console.log("Req body", req.body)
//     console.log("Req files", req.files)
//     const images = req.files?.map((file: Express.Multer.File) => file.path)
//     if (!images) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Images are required!")
//     }
//     const tourData = {
//         ...req.body,
//         images
//     }
//     const tour = await TourService.createTour(tourData)
//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: "Tour Created!",
//         data: tour
//     })
// })

const createTour = catchAsync(async (req: Request, res: Response) => {
    if (!req.files || req.files.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "At least one image is required!");
    }

    const tour = await TourService.createTour(
        req.body,
        req.files as Express.Multer.File[]
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour created successfully",
        data: tour
    });
});


const getAllTours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { tours, total, page, limit, totalPages } = await TourService.getAllTours(req.query as Record<string, string>)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Tours Retrieved!",
        data: tours,
        meta: {
            total,
            page,
            limit,
            totalPages
        }
    })
})



const getSingleTourBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.getSingleTourBySlug(req.params.slug)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tour Retrieved!",
        data: tour
    })
})


// const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const tour = await TourService.updateTour(req.params.id, req.body)
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Tour Updated!",
//         data: tour
//     })
// })
const updateTour = catchAsync(async (req: Request, res: Response) => {
    const tour = await TourService.updateTour(
      req.params.id,
      req.body,
      req.files as Express.Multer.File[]
    );
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour updated successfully",
      data: tour
    });
  });  


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
    getSingleTourBySlug,
    updateTour,
    deleteTour
}