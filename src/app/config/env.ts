import dotenv from "dotenv"
dotenv.config()

interface EnvConfigI {
    PORT: string
    DB_URI: string
    NODE_ENV: "development" | "production",
    JWT_SECRET: string
    ACCESS_TOKEN_EXPIRY: string
    HASHING_SALT: string
    SUPER_ADMIN_EMAIL: string
    SUPER_ADMIN_PASSWORD: string
}

const loadEnvVariables = (): EnvConfigI => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URI", "NODE_ENV", "JWT_SECRET", "ACCESS_TOKEN_EXPIRY", "HASHING_SALT", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"]
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required env variable: ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URI: process.env.DB_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as string,
        HASHING_SALT: process.env.HASHING_SALT as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string
    }
}
export const envVars = loadEnvVariables()