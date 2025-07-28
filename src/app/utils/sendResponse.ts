import { Response } from "express"

interface MetaT {
    total: number
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
        data: data.data,
        meta: data.meta
    })
}