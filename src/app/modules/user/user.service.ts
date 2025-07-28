import { UserI } from "./user.interface"
import { UserModel } from "./user.model"

const createUser = async (payload:Partial<UserI>) => {
    const user = await UserModel.create(payload)
    return user
}

const getAllUser = async () => {
    const users = await UserModel.find({})
    return users
}

export const UserService = {
    createUser,
    getAllUser
}