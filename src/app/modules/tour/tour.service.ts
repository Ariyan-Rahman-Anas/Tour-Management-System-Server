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


const getAllTours = async () => {
    const tours = await TourModel.find({}).populate("division").populate("tourType")
    return tours
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