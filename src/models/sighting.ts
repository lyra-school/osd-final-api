import { ObjectId } from "mongodb";
import Joi from "joi";

export interface Sighting {
    _id?: ObjectId;
    date: Date;
    location: Location;
    description: string;
    birds: ObjectId[];
    imageLink?: string;
    dateLastChanged?: Date;
    owner?: ObjectId;
}

interface Location {
    habitat: string;
    area: string;
}

export const ValidateNewSighting = (sighting: Sighting) => {
    const schema = Joi.object<Sighting>({
        description: Joi.string().min(10).max(256).required(),
        date: Joi.date().required(),
        location: Joi.object().optional(),
        birds: Joi.array().min(1).required(),
        imageLink: Joi.string().uri().optional(), // https://stackoverflow.com/questions/56367863/react-joi-uri-validation-optional
        owner: Joi.string().required()
    })
    return schema.validate(sighting);
}

export const ValidateSightingUpdate = (sighting: Sighting) => {
    const schema = Joi.object<Sighting>({
        description: Joi.string().min(10).max(256).optional(),
        date: Joi.date().optional(),
        location: Joi.object().optional(),
        birds: Joi.array().min(1).optional(),
        imageLink: Joi.string().uri().optional()
    })
    return schema.validate(sighting);
}

export const ValidateLocation = (location: Location) => {
    const schema = Joi.object<Location>({
        habitat: Joi.string().max(128).optional(),
        area: Joi.string().max(128).required()
    })
    return schema.validate(location);
}

export const ValidateLocationUpdate = (location: Location) => {
    const schema = Joi.object<Location>({
        habitat: Joi.string().max(128).optional(),
        area: Joi.string().max(128).optional()
    })
    return schema.validate(location);
}