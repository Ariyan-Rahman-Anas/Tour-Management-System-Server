/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import { UserModel } from "../modules/user/user.model";
import bcrypt from "bcryptjs"
import { Role } from "../constant";
import { IsActive } from "../constant";


// credentials auth
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email, password, done: any) => {
            try {
                const isUserExist = await UserModel.findOne({ email })
                if (!isUserExist) {
                    return done("User does not Exist!")
                }

                if (!isUserExist.isVerified) {
                    return done("Account Not Verified!")
                }
                if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
                    return done(`Account ${isUserExist.isActive}!`)
                }
                if (isUserExist.isDeleted) {
                    return done("Account Deleted!")
                }

                if (!isUserExist.password) {
                    const isGoogleAuthenticatedUser = isUserExist.auth.some(i => i.provider === "google")
                    if (isGoogleAuthenticatedUser) {
                        return done(null, false, {
                            message: "You are authenticated with Google, so now login with google and set an account password if you want to do credentials login. Thanks for your understanding!"
                        })
                    } else {
                        return done(null, false, { message: "No password set for this account!" })
                    }
                }

                const isPasswordMatched = await bcrypt.compare(password, isUserExist.password as string)
                if (!isPasswordMatched) {
                    return done(null, false, { message: "Incorrect Password!" })
                }
                return done(null, isUserExist)
            } catch (error) {
                done(error)
            }
        }
    )
)


// google auth
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
                    return done(null, false, { message: "Email not found" })
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
                                provider: "google",
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