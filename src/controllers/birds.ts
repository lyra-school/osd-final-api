import { Request, Response } from "express";
import { birdsCollection } from "../database";
import {Bird, ValidateBird, ValidateBirdUpdate} from '../models/bird'
import { ObjectId } from 'mongodb';
import Joi from "joi";

export const getAllBirds = async (req: Request, res: Response) => {
    try {
        const birds = (await birdsCollection.find({}).toArray()) as Bird[];
        res.status(200).json(birds);
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem retrieving birds: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to retrieve birds`);
    }
}

export const getAllBirdsFromFamily = async (req: Request, res: Response) => {
    try {
        let family: string = req.params.name;
        const birds = (await birdsCollection.find({"family":family})
            .project({'family':0,'familyAlternateName':0})
            .sort({'type': 1})
            .toArray()) as Bird[];
        res.status(200).json(birds);
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem retrieving birds: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to retrieve birds`);
    }
}

export const getBirdFromID = async (req: Request, res: Response) => {
    try {
        let id: string = req.params.id;
        const mongoId = {_id: new ObjectId(id)};
        const bird = (await birdsCollection.findOne(mongoId)) as Bird;

        if(bird) {
            res.status(200).json(bird);
        } else {
            res.status(404).send(`Cannot find bird with that ID`);
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem retrieving the bird: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to retrieve the bird`);
    }
}

export const createBird = async (req: Request, res: Response) => {
    try {
        let validation : Joi.ValidationResult = ValidateBird(req.body);

        if (validation.error) {
            res.status(400).json(validation.error);
            return;
        }

        const bird = req.body as Bird;

        const result = await birdsCollection.insertOne(bird);

        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new bird with ID ${result.insertedId}` });
        }
        else {
            res.status(500).send("Failed to create a new bird.");
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem inserting bird: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to create new bird`);
    }
}

export const updateBird = async (req: Request, res: Response) => {
    try {
        let validation : Joi.ValidationResult = ValidateBirdUpdate(req.body);

        if (validation.error) {
            res.status(400).json(validation.error);
            return;
        }

        let id: string = req.params.id;
        const change = req.body as Bird;
        const mongoId = {_id: new ObjectId(id)};
        const result = await birdsCollection.updateOne(mongoId, { $set: change });

        if (result.matchedCount != 0) {
            res.status(201).json({ message: `Updated the bird` });
        }
        else {
            res.status(500).send("Failed to update the bird");
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem updating bird: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to update the bird`);
    }
}

export const deleteBird = async (req: Request, res: Response) => {
    try {
        let id: string = req.params.id;
        const mongoId = {_id: new ObjectId(id)};
        const result = await birdsCollection.deleteOne(mongoId);

        if (result && result.deletedCount) {
            res.status(202).json({ message: `Successfully deleted the bird with ID ${id}` });
        } else if (!result) {
            res.status(400).json({ message: `Failed to delete the bird with ID ${id}` });
        } else if (!result.deletedCount) {
            res.status(404).json({ message: `No bird found with ID ${id}` });
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem deleting the bird: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to delete the bird`);
    }
}