import { Router } from "express";
import { UserController } from "./user.controller";
import { UserCreateZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router()

router.post("/register", validateRequest(UserCreateZodSchema), UserController.createUser)
router.get("/all-user", UserController.getAllUser)

export const UserRoute = router