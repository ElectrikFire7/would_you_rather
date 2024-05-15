import express from "express";
import { Question } from "../models/questionModel.js";

const router = express.Router();

router.post("/newQuestion", async (request, response) => {  
    try{
        if(!request.body.description || !request.body.option1 || !request.body.option2){
            return response.status(400).send({message: 'Send all required fields'})
        }

        const { description, option1, option2, user_id, anonymous } = request.body
        const newQuestion = new Question({
            description,
            option1,
            option2,
            owner: user_id,
            anonymous, 
        });

        await newQuestion.save();

        response.status(201).json(newQuestion);
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

export default router;