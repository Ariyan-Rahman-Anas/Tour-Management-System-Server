import { Response } from "express"

interface MetaT {
    total: number
    page?: number
    totalPages?: number
    limit?: number
}

interface ResponseT<T>{
    statusCode: number
    success: boolean
    message: string
    data: T
    meta?: MetaT
}

export const sendResponse = <T>(res: Response, data: ResponseT<T>) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: {
            total: data.meta?.total,
            page: data.meta?.page,
            totalPages: data.meta?.totalPages,
            limit: data.meta?.limit
        },
        data: data.data
    })
}