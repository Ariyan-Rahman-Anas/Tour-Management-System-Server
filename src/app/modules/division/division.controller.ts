import { NextFunction, Request, Response } from 'express';
import { DivisionService } from './division.service';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import AppError from '../../errorHelpers/appError';

//  Create division with thumbnail
const createDivision = catchAsync(async (req: Request, res: Response) => {
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
})

// Update division with optional thumbnail update
const updateDivision = catchAsync(async (req: Request, res: Response) => {
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
})

const getAllDivisions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
})


const getSingleDivisionBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionService.getSingleDivisionBySlug(req.params.slug)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Division Retrieved!",
        data: division
    })
})


const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await DivisionService.deleteDivision(req.params.id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Division Deleted!",
        data: null,
    })
})


export const DivisionController = {
    createDivision,
    getAllDivisions,
    getSingleDivisionBySlug,
    updateDivision,
    deleteDivision
}