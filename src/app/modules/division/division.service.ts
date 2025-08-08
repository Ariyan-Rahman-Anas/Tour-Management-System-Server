import AppError from "../../errorHelpers/appError"
import { DivisionI } from "./division.interface"
import { DivisionModel } from "./division.model"
import httpStatus from "http-status-codes"

const createDivision = async (payload: Partial<DivisionI>) => {
    const isDuplicate = await DivisionModel.findOne({ name: payload.name })
    if (isDuplicate) {
        throw new AppError(httpStatus.BAD_REQUEST, "Division already exists with this name!")
    }
    const division = await DivisionModel.create(payload)
    return {
        division
    }
}


const getAllDivisions = async () => {
    const divisions = await DivisionModel.find({})
    return divisions
}

const getSingleDivisionBySlug = async (slug: string) => {
    const division = await DivisionModel.findOne({ slug })
    return division
}


const updateDivision = async (id: string, payload: Partial<DivisionI>) => {
    const isDuplicate = await DivisionModel.findOne({ name: payload.name, _id: { $ne: id } })
    if (isDuplicate) {
        throw new AppError(httpStatus.BAD_REQUEST, "Division already exists with this name!")
    }
    const division = await DivisionModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    return {
        division
    }
}


const deleteDivision = async (id: string) => {
    await DivisionModel.findByIdAndDelete(id)
    return null
}


export const DivisionService = {
    createDivision,
    getAllDivisions,
    getSingleDivisionBySlug,
    updateDivision,
    deleteDivision
}