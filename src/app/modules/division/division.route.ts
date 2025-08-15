// // division.route.ts

// import { Router } from "express";
// import { DivisionController } from "./division.controller";
// import { checkAuthorization } from "../../middleware/checkAuth";
// import { validateRequest } from "../../middleware/validateRequest";
// import { DivisionCreateSchema, DivisionUpdateSchema } from "./division.validation";
// import { Role } from "../../constant";
// import { multerUploadCloudinarySingle } from "../../config/multer.config";

// const router = Router()
// router.post("/create", 
//     checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN),
//     multerUploadCloudinarySingle.single("thumbnail"), 
//     validateRequest(DivisionCreateSchema),
//     DivisionController.createDivision)


// router.get("/", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.getAllDivisions)
// router.get("/:slug", DivisionController.getSingleDivisionBySlug)
// router.patch("/:id", validateRequest(DivisionUpdateSchema), checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.updateDivision)
// router.delete("/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)

// export const DivisionRoute = router






// routes/division.route.ts
import { Router } from 'express';
import { DivisionController } from './division.controller';
import { DivisionCreateSchema, DivisionUpdateSchema } from './division.validation';
import { checkAuthorization } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { Role } from '../../constant';
import { uploadSingle } from '../../config/multer.config';

const router = Router();

// Create division with thumbnail
router.post(
  '/create',
  checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN),
  uploadSingle.single('thumbnail'),
  validateRequest(DivisionCreateSchema),
  DivisionController.createDivision
);

// Update division with optional thumbnail
router.patch(
  '/:id',
  checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN),
  uploadSingle.single('thumbnail'),
  validateRequest(DivisionUpdateSchema),
  DivisionController.updateDivision
);

// ... (keep existing routes for getAll, getSingle, delete)
router.get("/", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.getAllDivisions)
router.get("/:slug", DivisionController.getSingleDivisionBySlug)
router.delete("/:id", checkAuthorization(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision)

export const DivisionRoute = router;