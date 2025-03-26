import {ObjectId} from "mongodb";
import Joi from "joi";

export interface Bird {
    _id?: ObjectId;
    type: string;
    latinName: string;
    family: string;
    familyAlternateName: string;
    owner?: ObjectId;
}

export const ValidateBird = (bird: Bird) => {
    const schema = Joi.object<Bird>({
        type: Joi.string().max(64).required(),
        latinName: Joi.string().max(64).required(),
        family: Joi.string().max(64).required(),
        familyAlternateName: Joi.string().max(64).required(),
        owner: Joi.string().required()
    })
    return schema.validate(bird);
}

export const ValidateBirdUpdate = (bird: Bird) => {
    const schema = Joi.object<Bird>({
        type: Joi.string().max(64).optional(),
        latinName: Joi.string().max(64).optional(),
        family: Joi.string().max(64).optional(),
        familyAlternateName: Joi.string().max(64).optional()
    })
    return schema.validate(bird);
}
