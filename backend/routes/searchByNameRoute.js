import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/", async (request, response) => {
    //route for user to search questions by name
    try{
        const username = request.query.username;

        const user = await User.findOne({username}).populate("questions");

        return response.send(user.questions);
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

export default router;