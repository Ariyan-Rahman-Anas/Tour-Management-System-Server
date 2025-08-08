import { Query } from "mongoose"
import { excludeFields } from "../constant"

export class QueryBuilder<T>{
    public modelQuery:Query<T[], T>
    public readonly query:Record<string, string>

    constructor(modelQuery:Query<T[], T>, query:Record<string, string>) {
        this.modelQuery = modelQuery
        this.query = query
    }

    filter():this{
        const filter = {...this.query}

        for(const field of excludeFields){
            delete filter[field]
        }

        this.modelQuery = this.modelQuery.find(filter)
        return this
    }

    search(searchableFields:string[]):this{
        const search = this.query.search || ""
        this.modelQuery = this.modelQuery.find({
            $or:[
                ...searchableFields.map(field => ({[field]: {$regex:search, $options:"i"}}))
            ]
        })
        return this
    }

    sort():this{
        const sort = this.query.sort || "-createdAt"
        this.modelQuery = this.modelQuery.sort(sort)
        return this
    }

    select():this{
        const fields = this.query.fields?.split(",").join(" ") || ""
        this.modelQuery = this.modelQuery.select(fields)
        return this
    }

    pagination():this{
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 8
        const skip = (page - 1) * limit
        this.modelQuery = this.modelQuery.limit(limit).skip(skip)
        return this
    }

    populate(populate:string):this{
        this.modelQuery = this.modelQuery.populate(populate)
        return this
    }

    build(){
        return this.modelQuery
    }

    async getMeta(){
        const total = await this.modelQuery.model.countDocuments()
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 8
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
}