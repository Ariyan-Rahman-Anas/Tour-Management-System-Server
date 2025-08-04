export const handleCastError = () => {
    return {
        statusCode: 400,
        message: "Invalid mongoDB object ID"
    }
}