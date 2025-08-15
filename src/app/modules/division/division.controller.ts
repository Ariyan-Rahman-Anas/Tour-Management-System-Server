// // division.controller.ts

// import { NextFunction, Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { DivisionService } from "./division.service";
// import { sendResponse } from "../../utils/sendResponse";
// import httpStatus from "http-status-codes"
// import AppError from "../../errorHelpers/appError";

// const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const thumbnailUrl = req.file?.path

//     if (!thumbnailUrl) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Thumbnail image is required!")
//     }

//     const divisionData = {
//         ...req.body,
//         thumbnail: thumbnailUrl,
//     }

//     const division = await DivisionService.createDivision(divisionData)

//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: "Division Created!",
//         data: division
//     })
// })

// const getAllDivisions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const divisions = await DivisionService.getAllDivisions()
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "All Divisions Retrieved!",
//         data: divisions,
//         meta: {
//             total: divisions?.length
//         }
//     })
// })


// const getSingleDivisionBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const division = await DivisionService.getSingleDivisionBySlug(req.params.slug)
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Division Retrieved!",
//         data: division
//     })
// })


// const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const division = await DivisionService.updateDivision(req.params.id, req.body)
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Division Updated!",
//         data: division
//     })
// })


// const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     await DivisionService.deleteDivision(req.params.id)
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Division Deleted!",
//         data: null,
//     })
// })


// export const DivisionController = {
//     createDivision,
//     getAllDivisions,
//     getSingleDivisionBySlug,
//     updateDivision,
//     deleteDivision
// }





// controllers/division.controller.ts
import { NextFunction, Request, Response } from 'express';
import { DivisionService } from './division.service';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import AppError from '../../errorHelpers/appError';

export const DivisionController = {
    /**
     * Create division with thumbnail
     */
    createDivision: catchAsync(async (req: Request, res: Response) => {
        console.log("Req body", req.body)
        console.log("Req file", req.file)
        if (!req.file) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Thumbnail image is required');
        }

        const division = await DivisionService.createDivision(req.body, req.file);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Division created successfully',
            data: division
        });
    }),

    /**
     * Update division with optional thumbnail update
     */
    updateDivision: catchAsync(async (req: Request, res: Response) => {
        const division = await DivisionService.updateDivision(
            req.params.id,
            req.body,
            req.file
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Division updated successfully',
            data: division
        });
    }),

    // ... (keep existing methods for getAll, getSingle, delete)
    getAllDivisions: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const divisions = await DivisionService.getAllDivisions()
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All Divisions Retrieved!",
            data: divisions,
            meta: {
                total: divisions?.length
            }
        })
    }),


    getSingleDivisionBySlug: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const division = await DivisionService.getSingleDivisionBySlug(req.params.slug)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Division Retrieved!",
            data: division
        })
    }),


    deleteDivision: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await DivisionService.deleteDivision(req.params.id)
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Division Deleted!",
            data: null,
        })
    })

};