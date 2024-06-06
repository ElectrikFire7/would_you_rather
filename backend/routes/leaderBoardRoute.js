import express from "express";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/", async (request, response) => {
    //route for user to search questions by name
    try{
        const objectId1 = new mongoose.Types.ObjectId("665b6c0d6f4ff4ef502a8083");
        const objectId2 = new mongoose.Types.ObjectId("665ec5ccf0f9d9c3c31dc2b5");
        
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $nin: [objectId1, objectId2] }
                }
            },
            {
                $addFields: {
                    score: {
                        $add: [
                            { $ifNull: ["$rVotePoints", 0] },
                            { $size: { $ifNull: ["$votedQuestions", []] } },
                            { $multiply: [7, { $size: { $ifNull: ["$questions", []] } }] }
                        ]
                    }
                }
            },
            {
                $sort: {
                    score: -1
                }
            },
            {
                $project: {
                    username: 1,
                    _id: 1,
                    score: 1
                }
            }
        ]);

        return response.status(200).send(users);
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

export default router;