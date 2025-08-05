import { DivisionI } from "./division.interface"
import { DivisionModel } from "./division.model"

const createDivision = async (payload: Partial<DivisionI>) => {
    const division = await DivisionModel.create(payload)
    return {
        division
    }
}

export const DivisionService = {
    createDivision
}