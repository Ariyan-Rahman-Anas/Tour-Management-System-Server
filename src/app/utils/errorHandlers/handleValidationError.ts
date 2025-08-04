/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose"
import { ErrorSourcesT } from "../../middleware/globalErrorHandler"

export const handleValidationError = (err: mongoose.Error.ValidationError) => {
    const errorSources: ErrorSourcesT[] = []
    const errors = Object.values(err.errors)
    errors.forEach((err: any) => errorSources.push({
        path: err.path,
        message: err.message,
    }))
    return {
        statusCode: 400,
        message: "Validation error occurred!",
        errorSources
    }
}