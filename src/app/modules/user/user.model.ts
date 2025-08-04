import { model, Schema } from "mongoose";
import { AuthProviderI, IsActive, Role, UserI } from "./user.interface";

const authProviderSchema = new Schema<AuthProviderI>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, { versionKey: false, _id: false })

const userSchema = new Schema<UserI>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    phone: { type: String },
    image: { type: String },
    address: { type: String },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false},
    auth: [authProviderSchema]
}, { timestamps: true, versionKey: false })

export const UserModel = model<UserI>("user", userSchema)