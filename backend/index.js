import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js"
import questionRoute from "./routes/questionRoute.js"
import voteRoute from "./routes/voteRoute.js"
import cors from "cors";

const app = express();
app.use(express.json());

const corsOptions = {
    origin: ["http://localhost:5173"], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use("/user", userRoute);
app.use("/question", questionRoute);
app.use("/vote", voteRoute);

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