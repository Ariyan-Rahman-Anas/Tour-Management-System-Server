import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envVars } from "./env";
import { UserModel } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value
                if (!email) {
                    return done(null, false, {message: "Email not found"})
                }
                let user = await UserModel.findOne({ email })
                if (!user) {
                    user = await UserModel.create({
                        name: profile.displayName,
                        email,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auth: [
                            {
                                provider: "email",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    )
)


passport.serializeUser((user: any, done: (err: any, id: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await UserModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})