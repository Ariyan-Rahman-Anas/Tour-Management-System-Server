import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuthorization } from "../../middleware/checkAuth";
import passport from "passport";
import { Role } from "../../constant";
import { envVars } from "../../config/env";

const router = Router()

router.post("/login", AuthController.credentialsLogin)
router.post("/refresh-token", AuthController.getNewAccessToken)
router.post("/logout", AuthController.logout)
router.post("/set-password", checkAuthorization(...Object.values(Role)), AuthController.setPassword)
router.post("/reset-password", checkAuthorization(...Object.values(Role)), AuthController.resetPassword)
router.post("/forgot-password", AuthController.forgotPassword)
router.post("/change-password", checkAuthorization(...Object.values(Role)), AuthController.changePassword)

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect ?? "/"
    passport.authenticate("google", {scope:["profile", "email"], state: redirect as string})(req, res, next)
})
router.get("/google/callback", passport.authenticate("google", {failureRedirect: `${envVars.FRONTEND_URL}/login?error=Google Authentication Failed! Please contact with out support team `}), AuthController.googleCallback)


export const AuthRoute = router