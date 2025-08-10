import { Router } from "express";
import { DivisionController } from "./division.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { DivisionCreateSchema, DivisionUpdateSchema } from "./division.validation";
import { Role } from "../../constant";

const router = Router()

router.post("/create", validateRequest(DivisionCreateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.createDivision)
router.get("/", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.getAllDivisions)
router.get("/:slug", DivisionController.getSingleDivisionBySlug)
router.patch("/:id", validateRequest(DivisionUpdateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.updateDivision)
router.delete("/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)

export const DivisionRoute = router