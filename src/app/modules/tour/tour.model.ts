import { model, Schema } from "mongoose";
import { TourI, TourTypeI } from "./tour.interface";


const tourTypeSchema = new Schema<TourTypeI>({
    name:{type:String, required:true, unique:true}
}, { timestamps: true, versionKey:false })
export const TourTypeModel = model<TourTypeI>("tourType", tourTypeSchema)

const tourSchema = new Schema<TourI>({
    title:{type:String, required: true},
    slug:{type:String, unique:true},
    description:{type:String},
    images:{type:[String], default:[]},
    location:{type: String},
    cost:{type: Number},
    startDate:{type: Date},
    endDate:{type: Date},
    included:{type:[String], default:[]},
    excluded:{type:[String], default:[]},
    amenities:{type:[String], default:[]},
    tourPlan:{type:[String], default:[]},
    maxGuest:{type:Number},
    minAge:{type:Number},
    division:{type:Schema.Types.ObjectId, ref:"division", required:true},
    tourType:{type:Schema.Types.ObjectId, ref:"tourType", required:true},
    departure:{type:String},
    arrival:{type:String},
}, { versionKey: false, timestamps: true })


tourSchema.pre("save", async function (next) {
    if(this.isModified("title")){
        this.slug = this.title.toLowerCase().split(" ").join("-")
    }
    next()
})

tourSchema.pre("findOneAndUpdate", async function (next) {
    const tour = this.getUpdate() as Partial<TourI>
    if(tour.title){
        tour.slug = tour.title?.toLowerCase().split(" ").join("-")
    }
    this.setUpdate(tour)
    next()
})

export const TourModel = model<TourI>("tour", tourSchema)