import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js"
import questionRoute from "./routes/questionRoute.js"
import cors from "cors";

const app = express();
app.use(express.json());

//all origin
app.use(cors());

app.use("/user", userRoute);
app.use("/question", questionRoute);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("app connected to DB");
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });