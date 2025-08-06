import { DivisionI } from "./division.interface"
import { DivisionModel } from "./division.model"

const createDivision = async (payload: Partial<DivisionI>) => {
    const division = await DivisionModel.create(payload)
    return {
        division
    }
}



const getAllDivisions = async () => {
    const divisions = await DivisionModel.find({})
    return divisions
}



const updateDivision = async (id: string, payload: Partial<DivisionI>) => {
    const division = await DivisionModel.findByIdAndUpdate(id, payload, { new: true })
    return {
        division
    }
}



const deleteDivision = async (id: string) => {
    const division = await DivisionModel.findByIdAndDelete(id)
    return division
}


export const DivisionService = {
    createDivision,
    getAllDivisions,
    updateDivision,
    deleteDivision
}