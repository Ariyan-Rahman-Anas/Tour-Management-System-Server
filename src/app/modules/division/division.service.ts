// // division.service.ts

// import AppError from "../../errorHelpers/appError"
// import { DivisionI } from "./division.interface"
// import { DivisionModel } from "./division.model"
// import httpStatus from "http-status-codes"

// const createDivision = async (payload: Partial<DivisionI>) => {
//     const isDuplicate = await DivisionModel.findOne({ name: payload.name })
//     if (isDuplicate) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Division already exists with this name!")
//     }
//     const division = await DivisionModel.create(payload)
//     return division
// }


// const getAllDivisions = async () => {
//     const divisions = await DivisionModel.find({})
//     return divisions
// }

// const getSingleDivisionBySlug = async (slug: string) => {
//     const division = await DivisionModel.findOne({ slug })
//     return division
// }


// const updateDivision = async (id: string, payload: Partial<DivisionI>) => {
//     const isDuplicate = await DivisionModel.findOne({ name: payload.name, _id: { $ne: id } })
//     if (isDuplicate) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Division already exists with this name!")
//     }
//     const division = await DivisionModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
//     return {
//         division
//     }
// }


// const deleteDivision = async (id: string) => {
//     await DivisionModel.findByIdAndDelete(id)
//     return null
// }


// export const DivisionService = {
//     createDivision,
//     getAllDivisions,
//     getSingleDivisionBySlug,
//     updateDivision,
//     deleteDivision
// }







// services/division.service.ts
import { cloudinaryUtils } from '../../config/cloudinary.config';
import AppError from '../../errorHelpers/appError';
import { DivisionI } from './division.interface';
import { DivisionModel } from './division.model';
import httpStatus from 'http-status-codes';

const FOLDER_NAME = 'divisions';

export const DivisionService = {
    /**
     * Create new division with thumbnail
     */
    async createDivision(payload: Partial<DivisionI>, file?: Express.Multer.File) {
        // Check for duplicate name
        const isDuplicate = await DivisionModel.findOne({ name: payload.name });
        if (isDuplicate) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Division already exists!');
        }

        // Upload thumbnail if provided
        if (file) {
            const result = await cloudinaryUtils.uploadFile(file, FOLDER_NAME);
            payload.thumbnail = result.secure_url;
        }

        return DivisionModel.create(payload);
    },

    /**
     * Update division with optional thumbnail update
     */
    async updateDivision(id: string, payload: Partial<DivisionI>, file?: Express.Multer.File) {
        const division = await DivisionModel.findById(id);
        if (!division) {
            throw new AppError(httpStatus.NOT_FOUND, 'Division not found');
        }

        // Check for duplicate name (excluding current division)
        if (payload.name && payload.name !== division.name) {
            const isDuplicate = await DivisionModel.findOne({
                name: payload.name,
                _id: { $ne: id }
            });
            if (isDuplicate) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Division name already exists');
            }
        }

        // Handle file upload if new thumbnail provided
        if (file) {
            // Delete old thumbnail if exists
            if (division.thumbnail) {
                const publicId = division.thumbnail.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinaryUtils.deleteFile(`${FOLDER_NAME}/${publicId}`);
                }
            }

            // Upload new thumbnail
            const result = await cloudinaryUtils.uploadFile(file, FOLDER_NAME);
            payload.thumbnail = result.secure_url;
        }

        return DivisionModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
    },

    /**
     * Delete division and its thumbnail
     */
    async deleteDivision(id: string) {
        const division = await DivisionModel.findByIdAndDelete(id);

        if (division?.thumbnail) {
            const publicId = division.thumbnail.split('/').pop()?.split('.')[0];
            if (publicId) {
                await cloudinaryUtils.deleteFile(`${FOLDER_NAME}/${publicId}`);
            }
        }

        return division;
    },

    // ... (keep existing getAllDivisions, getSingleDivisionBySlug methods)
    getAllDivisions: async () => {
        const divisions = await DivisionModel.find({})
        return divisions
    },

    getSingleDivisionBySlug: async (slug: string) => {
        const division = await DivisionModel.findOne({ slug })
        return division
    }
};