// import { Types } from "mongoose"

// export interface TourTypeI{
//     name: string
// }

// export interface TourI{
//     title: string
//     slug: string
//     description?: string
//     images?: string[]
//     location?: string
//     cost?: number
//     startDate?: Date
//     endDate?: Date
//     included?: string[]
//     excluded?: string[]
//     amenities?: string[]
//     tourPlan?: string[]
//     maxGuest?: number
//     minAge?: number
//     division: Types.ObjectId
//     tourType: Types.ObjectId
//     departure?: string
//     arrival?: string
// }







// tour.interface.ts
import { Types } from "mongoose"

export interface CloudinaryImage {
  url: string;
  public_id: string;
  secure_url?: string;
}

export interface TourTypeI {
  name: string
}

export interface TourI {
  title: string
  slug: string
  description?: string
  images?: CloudinaryImage[]
  location?: string
  cost?: number
  startDate?: Date
  endDate?: Date
  included?: string[]
  excluded?: string[]
  amenities?: string[]
  tourPlan?: string[]
  maxGuest?: number
  minAge?: number
  division: Types.ObjectId
  tourType: Types.ObjectId
  departure?: string
  arrival?: string
}