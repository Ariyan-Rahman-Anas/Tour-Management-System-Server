/* eslint-disable no-console */
import { Server } from "http"
import mongoose from "mongoose"
import app from "./app"
import { envVars } from "./app/config/env"
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin"
import { connectRedis } from "./app/config/redis.config"

let server: Server

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URI)
        console.log("Connected to MongoDB!")
        server = app.listen(envVars.PORT, () => {
            console.log(`Tour MS server is running on port http://localhost:${envVars.PORT}`)
        })
    } catch (error) {
        console.log("Error from server file: ", error)
    }
}

(async () => {
    await connectRedis()
    await startServer()
    await seedSuperAdmin()
})()

process.on("SIGTERM", (err) => {
    console.log("Sigterm signal received, server is shutting down.", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})


process.on("SIGINT", (err) => {
    console.log("SigInt signal received, server is shutting down.", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection detected, server is shutting down.", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Unhandled expectation detected, server is shutting down.", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// Promise.reject(new Error("I forgot to handle this error"))
// throw new Error("I forgot to handled uncaught expectation error")