import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { TourTypeCreateSchema, TourTypeUpdateSchema } from "./tour.validation";
import { TourController } from "./tour.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/create-tour-type", validateRequest(TourTypeCreateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.CreateTourType)
router.get("/tour-types", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.getAllTourTypes)
router.put("/tour-types/:id", validateRequest(TourTypeUpdateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.updateTourType)
router.delete("/tour-types/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType)


export const TourRoute = router