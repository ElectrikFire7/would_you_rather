import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/userRoute.js"
import questionRoute from "./routes/questionRoute.js"
import voteRoute from "./routes/voteRoute.js"
import leaderBoardRoute from "./routes/leaderBoardRoute.js";
import createRoute from "./routes/createRoute.js";
import searchByNameRoute from "./routes/searchByNameRoute.js";

const app = express();
app.use(express.json());

const corsOptions = {
    origin: ["http://localhost:5173", "https://would-you-rather-1tns.onrender.com/", "https://would-you-rather-1tns.onrender.com"], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors());

app.use("/user", userRoute);
app.use("/question", questionRoute);
app.use("/vote", voteRoute);
app.use("/createQuestion", createRoute);
app.use("/searchByName", searchByNameRoute);
app.use("/leaderBoard", leaderBoardRoute);

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