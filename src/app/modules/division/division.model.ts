import { model, Schema } from "mongoose";
import { DivisionI } from "./division.interface";

const divisionSchema = new Schema<DivisionI>({
    name: { type: String,  required: true, unique:true},
    slug: { type: String, unique:true},
    thumbnail: {type:String},
    description: {type:String}
},{versionKey:false, timestamps:true})


divisionSchema.pre("save", async function (next) {
    if(this.isModified("name")){
        this.slug = this.name.toLowerCase().split(" ").join("-") + "-Division"
    }
    next()
})

divisionSchema.pre("findOneAndUpdate", async function (next) {
    const division = this.getUpdate() as Partial<DivisionI>
    if(division.name){
        division.slug = division.name?.toLowerCase().split(" ").join("-") + "-Division"
    }
    this.setUpdate(division)
    next()
})

export const DivisionModel = model<DivisionI>("division", divisionSchema)