import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { TourCreateZodSchema, TourTypeCreateSchema, TourTypeUpdateSchema, TourUpdateZodSchema } from "./tour.validation";
import { TourController } from "./tour.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";

const router = Router()

router.post("/create-tour-type", validateRequest(TourTypeCreateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.CreateTourType)
router.get("/tour-types", TourController.getAllTourTypes)
router.patch("/tour-types/:id", validateRequest(TourTypeUpdateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.updateTourType)
router.delete("/tour-types/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType)
    
router.post("/create", validateRequest(TourCreateZodSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.createTour)
router.get("/", TourController.getAllTours)
router.get("/:slug", TourController.getSingleTourBySlug)
router.patch("/:id", validateRequest(TourUpdateZodSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.updateTour)
router.delete("/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour)

export const TourRoute = router