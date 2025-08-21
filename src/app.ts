import  express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"
import notFound from "./app/middleware/notFound"
import passport from "passport"
import "./app/config/passport"
import expressSession from "express-session"
import { envVars } from "./app/config/env"

const app = express()
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.set("trust proxy", 1)
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
    methods:["POST", "GET", "PUT", "PATCH", "DELETE"]
}))

app.use("/api/v1", router )

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Server"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app