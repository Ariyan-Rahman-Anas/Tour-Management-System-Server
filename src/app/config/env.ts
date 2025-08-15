import dotenv from "dotenv"
dotenv.config()

interface EnvConfigI {
    PORT: string
    DB_URI: string
    NODE_ENV: "development" | "production",
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
    ACCESS_TOKEN_EXPIRY: string
    REFRESH_TOKEN_EXPIRY: string
    HASHING_SALT: string
    SUPER_ADMIN_EMAIL: string
    SUPER_ADMIN_PASSWORD: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CALLBACK_URL: string
    FRONTEND_URL: string
    EXPRESS_SESSION_SECRET: string
    SSL: {
        SSL_STORE_ID: string
        SSL_STORE_PASSWORD: string
        SSL_PAYMENT_API: string
        SSL_VALIDATION_API: string
        SSL_SUCCESS_FRONTEND_URL: string
        SSL_FAIL_FRONTEND_URL: string
        SSL_CANCEL_FRONTEND_URL: string
        SSL_SUCCESS_BACKEND_URL: string
        SSL_FAIL_BACKEND_URL: string
        SSL_CANCEL_BACKEND_URL: string
    }
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string
        CLOUDINARY_API_KEY: string
        CLOUDINARY_API_SECRET: string
    }
}

const loadEnvVariables = (): EnvConfigI => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URI",
        "NODE_ENV",
        "ACCESS_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRY",
        "REFRESH_TOKEN_SECRET",
        "REFRESH_TOKEN_EXPIRY",
        "HASHING_SALT",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CALLBACK_URL",
        "FRONTEND_URL",
        "EXPRESS_SESSION_SECRET",
        "SSL_STORE_ID",
        "SSL_STORE_PASSWORD",
        "SSL_PAYMENT_API",
        "SSL_VALIDATION_API",
        "SSL_SUCCESS_FRONTEND_URL",
        "SSL_FAIL_FRONTEND_URL",
        "SSL_CANCEL_FRONTEND_URL",
        "SSL_SUCCESS_BACKEND_URL",
        "SSL_FAIL_BACKEND_URL",
        "SSL_CANCEL_BACKEND_URL",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET"
    ]
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required env variable: ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URI: process.env.DB_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as string,
        HASHING_SALT: process.env.HASHING_SALT as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID as string,
            SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD as string,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        }
    }
}
export const envVars = loadEnvVariables()