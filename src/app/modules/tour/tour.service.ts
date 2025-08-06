import { TourTypeI } from "./tour.interface"
import { TourTypeModel } from "./tour.model"

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


export const TourService = {
    CreateTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}