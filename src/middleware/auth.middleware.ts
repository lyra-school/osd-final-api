import { Request, Response, NextFunction } from "express";
import { verify as jwtVerify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { birdsCollection, sightingsCollection } from "../database";
import { Bird } from "../models/bird";
import { Sighting } from "../models/sighting";
import { role } from "../models/user";

export const validJWTProvided = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {


    const authHeader = req.headers?.authorization;
    console.log(authHeader);

    if (!authHeader || !authHeader?.startsWith('Bearer')) {
        console.log('no header ' + authHeader)
        res.status(401).send();
        return;
    }


    const token: string | undefined = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).send();
        return;
    }
    const secret = process.env.JWTSECRET || "not very secret";


    try {
        console.log(token);
        const payload = jwtVerify(token, secret);
        res.locals.payload = payload;
        next();


    } catch (err) {
        res.status(403).send();
        return;
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const roleJWT = res.locals?.payload?.role;
    if (roleJWT == role["admin"]) {
        next();
    }
    else {
        res.status(403).json({ "error": "not an admin" });
    }

};

export const isOwnerOrAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const id = req.params.id;
    const user_id = res.locals?.payload?._id;

    if(id && user_id && id == user_id) {
        next();
    }
    const role = res.locals?.payload?.role;
    if (role && role == 'admin') {
        next();
    }
    else {
        res.status(403).json({ "error": "not an admin or a resource owner" });
    }
}

// no clue how to pass in params other than req, res to these fncs
export const isOwnerOrAdminBird = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let a: boolean = false;
    try {
        let id: string = req.params.id;
        const query = { _id: new ObjectId(id) };

        // https://stackoverflow.com/questions/60536941/mongodb-projection-parameter-not-working-in-findone
        const bird = (await birdsCollection.findOne(query, {projection: {"owner":1}})) as Bird;
        const user_id = res.locals?.payload?._id;
        if(bird.owner as any && user_id && bird.owner as any == user_id as any) {
            a = true;
            next();
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log(`issue with retrieving ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
    }
    if(!a) {
        const roleJWT = res.locals?.payload?.role;
        // https://stackoverflow.com/questions/39785320/how-to-compare-enums-in-typescript
        if (roleJWT == role["admin"]) {
            next();
        }
        else {
            res.status(403).json({ "error": "not an admin or a resource owner" });
        }
    }
}

// no clue how to pass in params other than req, res to these fncs
export const isOwnerOrAdminSighting = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let a: boolean = false;
    try {
        let id: string = req.params.id;
        const query = { _id: new ObjectId(id) };
        const sighting = (await sightingsCollection.findOne(query, {projection: {"owner":1}})) as Sighting;
        const user_id = res.locals?.payload?._id;

        if(sighting.owner as any && user_id && sighting.owner as any == user_id) {
            a = true;
            next();
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log(`issue with retrieving ${error.message}`);
        }
        else {
            console.log(`error with ${error}`)
        }
    }
    if(!a) {
        const roleJWT = res.locals?.payload?.role;
        if (roleJWT == role["admin"]) {
            next();
        }
        else {
            res.status(403).json({ "error": "not an admin or a resource owner" });
        }
    }
}