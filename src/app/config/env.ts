import dotenv from "dotenv"
dotenv.config()

interface EnvConfigI {
    PORT: string
    DB_URI: string
    NODE_ENV: "development" | "production"
}

const loadEnvVariables = (): EnvConfigI => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URI", "NODE_ENV"]
    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required env variable: ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URI: process.env.DB_URI as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production"
    }
}
export const envVars = loadEnvVariables()