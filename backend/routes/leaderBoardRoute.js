import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/", async (request, response) => {
    //route for user to search questions by name
    try{
        const users = await User.aggregate([
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