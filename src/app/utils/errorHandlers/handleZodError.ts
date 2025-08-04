/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorSourcesT } from "../../middleware/globalErrorHandler"

export const handleZodError = (err: any) => {
    const errorSources: ErrorSourcesT[] = []
    err.issues.forEach((issue: any) => errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        }))
    return {
        statusCode: 400,
        message: "Zod error occurred!",
        errorSources
    }
}