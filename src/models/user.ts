import { ObjectId } from "mongodb";
import Joi from "joi";

export interface User {
    _id?: ObjectId,
    name: string,
    email: string,
    password?: string,
    hashedPassword?: string,
    about?: string,
    role?: role
}

export enum role {
    admin,
    ''
}

export const ValidateNewUser = (user: User) => {

    const schema = Joi.object<User>({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(64).required(),
        role: Joi.string().valid(...Object.values(role))
    })

    return schema.validate(user);
}

export const ValidateUserUpdate = (user: User) => {

    const schema = Joi.object<User>({
        name: Joi.string().min(3).optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(8).max(64).optional(),
        about: Joi.string().max(256).optional()
    })

    return schema.validate(user);
}