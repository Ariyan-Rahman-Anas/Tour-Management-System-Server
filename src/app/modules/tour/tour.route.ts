import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { TourTypeCreateSchema, TourTypeUpdateSchema } from "./tour.validation";
import { TourController } from "./tour.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import { Role } from "../../constant";
import { uploadMultiple } from "../../config/multer.config";

const router = Router()

// tour types
router.post("/create-tour-type",
    validateRequest(TourTypeCreateSchema),
    checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN),
    TourController.CreateTourType)

router.get("/tour-types", 
    // checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), 
    TourController.getAllTourTypes)

router.patch("/tour-types/:id",
    validateRequest(TourTypeUpdateSchema),
    checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN),
    TourController.updateTourType)

router.delete("/tour-types/:id", 
    checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), 
    TourController.deleteTourType)



// tours
router.post("/create", 
    checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN),
    uploadMultiple.array('images', 5),
    TourController.createTour)

router.get("/", 
    // checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), 
    TourController.getAllTours)

router.get("/:slug", 
    TourController.getSingleTourBySlug)

router.patch("/:id", 
    checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), 
    uploadMultiple.array('images', 5),
    TourController.updateTour)

router.delete("/:id", 
    checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), 
    TourController.deleteTour)

export const TourRoute = router