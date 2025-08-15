import { CloudinaryImage, TourI, TourTypeI } from "./tour.interface"
import { TourModel, TourTypeModel } from "./tour.model"
import { searchableFields } from "../../constant"
import { QueryBuilder } from "../../utils/QueryBuilder"
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/appError"
import { cloudinaryUtils } from "../../config/cloudinary.config"

// tour type
const CreateTourType = async (payload: Partial<TourTypeI>) => {
    const tourType = await TourTypeModel.create(payload)
    return tourType
}

const getAllTourTypes = async () => {
    const tourTypes = await TourTypeModel.find({})
    return tourTypes
}

const updateTourType = async (id: string, payload: Partial<TourTypeI>) => {
    const tourType = await TourTypeModel.findByIdAndUpdate(id, payload, { new: true })
    return tourType
}

const deleteTourType = async (id: string) => {
    const tourType = await TourTypeModel.findByIdAndDelete(id)
    return tourType
}



// const FOLDER_NAME = 'tours';

// tour
// const createTour = async (payload: Partial<TourI>, files?: Express.Multer.File[]) => {
//     const isDuplicate = await TourModel.findOne({ title: payload.title })
//     if (isDuplicate) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Tour already exists!')
//     }

//     // upload images
//     if (files) {
//         const result = await cloudinaryUtils.uploadFile(files, FOLDER_NAME);
//         payload.images = result.secure_url;
//     }

//     const tour = await TourModel.create(payload)
//     const populatedWithDivision = await tour.populate("division")
//     const populatedWithTourType = await populatedWithDivision.populate("tourType")
//     return populatedWithTourType
// }

const FOLDER_NAME = 'tours';

const createTour = async (payload: Partial<TourI>, files?: Express.Multer.File[]) => {
    const isDuplicate = await TourModel.findOne({ title: payload.title });
    if (isDuplicate) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Tour already exists!');
    }

    // Upload images if provided
    if (files && files.length > 0) {
        const uploadPromises = files.map(file =>
            cloudinaryUtils.uploadFile(file, FOLDER_NAME)
        );
        payload.images = await Promise.all(uploadPromises);
    }

    const tour = await TourModel.create(payload);
    return tour.populate(["division", "tourType"]);
};

// const getAllToursOld = async (query: Record<string, string>) => {
//     const filter =  query
//     const search = query.search || ""
//     const sort = query.sort ?? "-createdAt"
//     const fields = query.fields?.split(",").join(" ") || ""
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 8
//     const skip = (page - 1) * limit

//     const excludeFields = ["search", "sort", "fields", "limit", "skip", "page"]
//     for(const field of excludeFields){
//         delete filter[field]
//     }

//     const searchableFields = ["title", "location", "description"]

//     const tours = await TourModel
//     .find({
//         $or:[
//             ...searchableFields.map(field => ({[field]: {$regex:search, $options:"i"}}))
//         ]
//     })
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .limit(limit)
//     .skip(skip)
//     .populate("division")
//     .populate("tourType")

//     const total = await TourModel.countDocuments()
//     return {
//         tours,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit)
//     }
// }

const getAllTours = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(TourModel.find(), query)
    const tours = await queryBuilder
        .search(searchableFields)
        .filter()
        .sort()
        .select()
        .pagination()
        .populate("division")
        .populate("tourType")
        .build()

    const meta = await queryBuilder.getMeta()

    return {
        tours,
        ...meta
    }
}

const getSingleTourBySlug = async (slug: string) => {
    const tour = await TourModel.findOne({ slug })
    return tour
}


const updateTour = async (id: string, payload: Partial<TourI>, files?: Express.Multer.File[]) => {
    const tour = await TourModel.findById(id);
    if (!tour) {
        throw new AppError(httpStatus.NOT_FOUND, 'Tour not found');
    }

    // Handle new image uploads
    if (files && files.length > 0) {
        // Delete old images first
        if (tour.images && tour.images.length > 0) {
            const deletePromises = tour.images.map(image =>
                cloudinaryUtils.deleteFile(image.public_id)
            );
            await Promise.all(deletePromises);
        }

        // Upload new images
        const uploadPromises = files.map(file =>
            cloudinaryUtils.uploadFile(file, FOLDER_NAME)
        );
        payload.images = await Promise.all(uploadPromises);
    }

    const updatedTour = await TourModel.findByIdAndUpdate(id, payload, {
        new: true
    }).populate(["division", "tourType"]);

    return updatedTour;
};


const deleteTour = async (id: string) => {
    const tour = await TourModel.findByIdAndDelete(id);

    // Clean up images from Cloudinary
    if (tour?.images && tour.images.length > 0) {
        const deletePromises = tour.images.map(image =>
            cloudinaryUtils.deleteFile(image.public_id)
        );
        await Promise.all(deletePromises);
    }

    return tour;
};


export const TourService = {
    CreateTourType,
    getAllTourTypes,
    getSingleTourBySlug,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTours,
    updateTour,
    deleteTour
}