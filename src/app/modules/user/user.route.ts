import { Router } from "express";
import { UserController } from "./user.controller";
import { UserCreateZodSchema, UserUpdateZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";

const router = Router()

router.post("/register", validateRequest(UserCreateZodSchema), UserController.createUser)

router.get("/me", checkAuthorization(...Object.values(Role)), UserController.getLoggedInUser)

router.get("/all-user", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUser)

router.get("/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), UserController.getUserById)

router.patch("/:id", validateRequest(UserUpdateZodSchema), checkAuthorization(...Object.values(Role)), UserController.UpdateUser)


export const UserRoute = router