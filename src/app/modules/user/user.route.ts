import { Router } from "express";
import { UserController } from "./user.controller";
import { UserCreateZodSchema, UserUpdateZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "./user.interface";

const router = Router()

router.post("/register", validateRequest(UserCreateZodSchema), UserController.createUser)

router.patch("/:id", validateRequest(UserUpdateZodSchema), checkAuthorization(...Object.values(Role)), UserController.UpdateUser)

router.get("/all-user", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUser)

export const UserRoute = router