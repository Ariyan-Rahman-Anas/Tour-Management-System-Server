import { TourI, TourTypeI } from "./tour.interface"
import { TourModel, TourTypeModel } from "./tour.model"

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



const createTour = async (payload: Partial<TourI>) => {
    const tour = await TourModel.create(payload)
    return tour
}


const getAllTours = async (query: Record<string, string>) => {
    const filter =  query
    const search = query.search || ""
    const sort = query.sort ?? "-createdAt"
    const fields = query.fields?.split(",").join(" ") || ""
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 8
    const skip = (page - 1) * limit

    const excludeFields = ["search", "sort", "fields", "limit", "skip", "page"]
    for(const field of excludeFields){
        delete filter[field]
    }

    const searchableFields = ["title", "location", "description"]

    const tours = await TourModel
    .find({
        $or:[
            ...searchableFields.map(field => ({[field]: {$regex:search, $options:"i"}}))
        ]
    })
    .find(filter)
    .sort(sort)
    .select(fields)
    .limit(limit)
    .skip(skip)
    .populate("division")
    .populate("tourType")

    const total = await TourModel.countDocuments()
    return {
        tours,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    }
}


const updateTour = async (id: string, payload: Partial<TourI>) => {
    const tour = await TourModel.findByIdAndUpdate(id, payload, { new: true }).populate("division").populate("tourType")
    return tour
}


const deleteTour = async (id: string) => {
    const tour = await TourModel.findByIdAndDelete(id)
    return tour
}



export const TourService = {
    CreateTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType,
    createTour,
    getAllTours,
    updateTour,
    deleteTour
}