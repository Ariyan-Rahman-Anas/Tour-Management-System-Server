import { model, Schema } from "mongoose";
import { DivisionI } from "./division.interface";

const divisionSchema = new Schema<DivisionI>({
    name: { type: String,  required: true, unique:true},
    slug: { type: String, unique:true},
    thumbnail: {type:String},
    description: {type:String}
},{versionKey:false, timestamps:true})

export const DivisionModel = model<DivisionI>("division", divisionSchema)