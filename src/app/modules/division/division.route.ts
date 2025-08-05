import { Router } from "express";
import { DivisionController } from "./division.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/create", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.createDivision)

export const DivisionRoute = router