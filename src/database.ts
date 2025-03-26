import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import { Bird } from "./models/bird";
import { Sighting } from "./models/sighting";
import { User } from "./models/user";

dotenv.config();
const connectionString: string = process.env.DB_CONN_STRING || "";
const dbName: string = process.env.DB_NAME || "Web2_Final";
const client = new MongoClient(connectionString);

let db: Db;
export let birdsCollection: Collection<Bird>;
export let sightingsCollection: Collection<Sighting>;
export let usersCollection: Collection<User>;

export const birdCol: { birds?: Collection<Bird>} = {};
export const sightingCol: { sightings?: Collection<Sighting>} = {};
export const userCol: { users?: Collection<User>} = {};

client.connect().then
    (() => {
        db = client.db(dbName);
        birdsCollection = db.collection('birds');
        sightingsCollection = db.collection('bird_sightings');
        usersCollection = db.collection('bird_users');
        birdCol.birds = birdsCollection;
        sightingCol.sightings = sightingsCollection;
        userCol.users = usersCollection;
    }).catch((error) => {
        if(error instanceof Error) {
            console.log(`Issue connecting to database: ${error.message}`);
        } else {
            console.log(`Error: ${error}`);
        }
    });