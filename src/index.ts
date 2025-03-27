import express, { Application } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import birdRouter from './routes/birds';
import sightingRouter from './routes/sightings';
import userRouter from './routes/users';
import authRouter from './routes/auth';
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(cors());

app.use(morgan("tiny"));

app.use(express.json());

app.use('/birds', birdRouter);
app.use('/sightings', sightingRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

var server = app.listen(PORT, function () {
    console.log("Listening on port: " + PORT)
});