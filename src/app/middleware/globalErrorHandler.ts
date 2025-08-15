// globalErrorHandler.ts

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import { handleCastError } from "../utils/errorHandlers/handleCastError"
import { handleValidationError } from "../utils/errorHandlers/handleValidationError"
import { handleZodError } from "../utils/errorHandlers/handleZodError"
import { handleDuplicateError } from "../utils/errorHandlers/handleDuplicateError"

export interface ErrorSourcesT {
    path: string
    message: string
}


export const globalErrorHandler = ((err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error Showing form Global Error Handler: ", err)
    }
    
    let statusCode = 500
    let message = `Something went wrong!`
    let errorSources: any = []

    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError()
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    
    else if (err.name === "ZodError") {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources
    }
    
    else if (err.name == "ValidationError") {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources
    }
    
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }
    
    else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err :envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
})