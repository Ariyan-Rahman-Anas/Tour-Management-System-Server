import  express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"
import notFound from "./app/middleware/notFound"
import passport from "passport"
import expressSession from "express-session"

const app = express()
app.use(expressSession({
    secret: "Tour-MS-Ex-Session",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api/v1", router )

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Server"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app