import { Router } from "express";
import { DivisionController } from "./division.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { DivisionCreateSchema, DivisionUpdateSchema } from "./division.validation";

const router = Router()

router.post("/create", validateRequest(DivisionCreateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.createDivision)
router.get("/", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.getAllDivisions)
router.patch("/:id", validateRequest(DivisionUpdateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.updateDivision)
router.delete("/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)

export const DivisionRoute = router