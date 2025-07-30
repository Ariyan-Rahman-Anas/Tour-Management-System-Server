/* eslint-disable no-console */
import { envVars } from "../config/env"
import { AuthProviderI, Role, UserI } from "../modules/user/user.interface"
import { UserModel } from "../modules/user/user.model"
import bcrypt from "bcryptjs"

export const seedSuperAdmin = async() => {
    try {
        const isSuperAdminExist = await UserModel.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        if (isSuperAdminExist) {
            console.log("Super Admin Saheb already exist!")
            return
        }

        console.log("Creating Super Admin")

        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.HASHING_SALT))

        const authProvider: AuthProviderI = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }
        
        const payload:UserI = {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            auth: [authProvider],
            isVerified: true
        } 
        const superAdmin = await UserModel.create(payload)
        console.log("Super Admin Created!", {superAdmin})
    } catch (error) {
        console.log(error)
    }
}