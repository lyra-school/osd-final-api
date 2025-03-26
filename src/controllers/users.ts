import { Request, Response } from "express";
import { usersCollection } from "../database";
import { User, role } from "../models/user";
import { ValidateNewUser, ValidateUserUpdate } from "../models/user";
import { ObjectId } from 'mongodb';
import Joi from "joi";
import argon2 from "argon2";

export const getUsers = async (req: Request, res: Response) => {

    try {
        const users = (await usersCollection.find({}).project({"hashedPassword":0, "email":0}).toArray()) as User[];
        res.status(200).json(users);

    } catch (error) {
        if (error instanceof Error) {
            console.log(`issue with retrieving ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
        res.status(400).send(`Unable to retrieve users`);
    }
};


export const getUserById = async (req: Request, res: Response) => {
    //get a single  user by ID from the database

    let id: string = req.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const user = (await usersCollection.findOne(query, {projection: {"hashedPassword": 0,"email":0}})) as User;

        if (user) {
            res.status(200).send(user);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(`issue with retrieving ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
        res.status(400).send(`Unable to retrieve user`);
    }
};


export const createUser = async (req: Request, res: Response) => {
    // create a new user in the database
    try {
        let validateResult: Joi.ValidationResult = ValidateNewUser(req.body)

        if (validateResult.error) {
            res.status(400).json(validateResult.error);
            return;
        }

        const existingUser = await usersCollection.findOne({ email: req.body.email })

        if (existingUser) {
            res.status(400).json({ "error": "existing email" });
            return;
        }

        let newUser: User =
        {
            name: req.body.name,
            email: req.body.email,
            role: role[""]
        }

        newUser.hashedPassword = await argon2.hash(req.body.password)

        console.log(newUser.hashedPassword)

        const result = await usersCollection.insertOne(newUser)

        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` })
        }
        else {
            res.status(500).send("Failed to create a new user.");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with inserting ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
        res.status(400).send(`Unable to create new user`);
    }
};

export const createAdminUser = async (req: Request, res: Response) => {
    // create a new user in the database
    try {
        let validateResult: Joi.ValidationResult = ValidateNewUser(req.body)

        if (validateResult.error) {
            res.status(400).json(validateResult.error);
            return;
        }

        const existingUser = await usersCollection.findOne({ email: req.body.email })

        if (existingUser) {
            res.status(400).json({ "error": "existing email" });
            return;
        }

        let newUser: User =
        {
            name: req.body.name,
            email: req.body.email,
            role: role["admin"]
        }

        newUser.hashedPassword = await argon2.hash(req.body.password)

        console.log(newUser.hashedPassword)

        const result = await usersCollection.insertOne(newUser)

        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` })
        }
        else {
            res.status(500).send("Failed to create a new user.");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with inserting ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
        res.status(400).send(`Unable to create new user`);
    }
};


export const updateUser = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    try {
        const newData = req.body as User;

        let validateResult: Joi.ValidationResult = ValidateUserUpdate(req.body)

        if (validateResult.error) {
            res.status(400).json(validateResult.error);
            return;
        }

        const query = { _id: new ObjectId(id) };

        const result = await usersCollection.updateOne(query, { $set: newData });

        if (result.matchedCount != 0) {
            res.status(201).json({ message: `Updated user` })
        }
        else {
            res.status(500).send("Failed to update a user.");
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(`issue with updating ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
        res.status(400).send(`Unable to update user`);
    }

}

export const deleteUser = async (req: Request, res: Response) => {

    let id: string = req.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).json({ message: `Successfully removed user with id ${id}` });
        } else if (!result) {
            res.status(400).json({ message: `Failed to remove user with id ${id}` });
        } else if (!result.deletedCount) {
            res.status(404).json({ message: `no user fround with id ${id}` });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(`issue with deletion ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
        res.status(400).send(`Unable to delete user`);
    }
};