import { Request, Response } from "express";
import { sightingsCollection } from "../database";
import {Sighting, ValidateLocation, ValidateLocationUpdate, ValidateNewSighting, ValidateSightingUpdate} from '../models/sighting'
import { ObjectId } from 'mongodb';
import Joi from "joi";

export const getAllSightings = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

        const sightings = (await sightingsCollection.find({})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()) as Sighting[];
        res.status(200).json(sightings);
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem retrieving sightings: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to retrieve sightings`);
    }
}

export const getSightingFromID = async (req: Request, res: Response) => {
    try {
        let id: string = req.params.id;
        const mongoId = {_id: new ObjectId(id)};
        const sighting = (await sightingsCollection.findOne(mongoId)) as Sighting;
        if(sighting) {
            res.status(200).json(sighting);
        } else {
            res.status(404).send(`Cannot find a sighting with that ID`);
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem retrieving the sighting: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to retrieve the sighting`);
    }
}

export const createSighting = async (req: Request, res: Response) => {
    try {
        let validation : Joi.ValidationResult = ValidateNewSighting(req.body);

        if (validation.error) {
            res.status(400).json(validation.error);
            return;
        }

        const sighting = req.body as Sighting;
        let validation2 : Joi.ValidationResult = ValidateLocation(sighting.location);

        if (validation2.error) {
            res.status(400).json(validation2.error);
            return;
        }

        if(sighting.date !== null && sighting.date !== undefined) {
            sighting.date = new Date(sighting.date);
        }

        let originalArray = sighting.birds; 

        if(sighting.birds !== null && sighting.birds !== undefined) {
            sighting.birds = [];
            for(let birdId of originalArray) {
                sighting.birds.push(new ObjectId(birdId));
            }
        }
        
        sighting.dateLastChanged = new Date(Date.now());

        const result = await sightingsCollection.insertOne(sighting);

        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new sighting with ID ${result.insertedId}` });
        }
        else {
            res.status(500).send("Failed to create a new sighting.");
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem inserting the sighting: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to create a new sighting`);
    }
}

export const updateSighting = async (req: Request, res: Response) => {
    try {
        let validation : Joi.ValidationResult = ValidateSightingUpdate(req.body);

        if (validation.error) {
            res.status(400).json(validation.error);
            return;
        }

        const change = req.body as Sighting;
        let validation2 : Joi.ValidationResult = ValidateLocationUpdate(change.location);

        if (validation2.error) {
            res.status(400).json(validation2.error);
            return;
        }
        let id: string = req.params.id;
        if(change.date !== null && change.date !== undefined) {
            change.date = new Date(change.date);
        }
        change.dateLastChanged = new Date(Date.now());

        let originalArray = change.birds; 

        if(change.birds !== null && change.birds !== undefined) {
            change.birds = [];
            for(let birdId of originalArray) {
                change.birds.push(new ObjectId(birdId));
            }
        }
        const mongoId = {_id: new ObjectId(id)};
        

        const result = await sightingsCollection.updateOne(mongoId, { $set: change });

        if (result.matchedCount != 0) {
            res.status(201).json({ message: `Updated the sighting` });
        }
        else {
            res.status(500).send("Failed to update the sighting");
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem updating the sighting: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to update the sighting`);
    }
}

export const deleteSighting = async (req: Request, res: Response) => {
    try {
        let id: string = req.params.id;
        const mongoId = {_id: new ObjectId(id)};
        const result = await sightingsCollection.deleteOne(mongoId);

        if (result && result.deletedCount) {
            res.status(202).json({ message: `Successfully deleted the sighting with ID ${id}` });
        } else if (!result) {
            res.status(400).json({ message: `Failed to delete the sighting with ID ${id}` });
        } else if (!result.deletedCount) {
            res.status(404).json({ message: `No sighting found with ID ${id}` });
        }
    } catch(error) {
        if (error instanceof Error) {
            console.log(`Problem deleting the sighting: ${error.message}`);
        }
        else {
            console.log(`Error: ${error}`);
        }
        res.status(400).send(`Unable to delete the sighting`);
    }
}