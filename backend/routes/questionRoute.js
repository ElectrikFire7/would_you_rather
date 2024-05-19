import express from "express";
import { Question } from "../models/questionModel.js";
import { User } from "../models/userModel.js";

const router = express.Router();

router.post("/newQuestion", async (request, response) => {  
    try{
        if(!request.body.description || !request.body.option1 || !request.body.option2){
            return response.status(400).send({message: 'Send all required fields'})
        }

        const { description, option1, option2, username, user_id, anonymous } = request.body
        const newQuestion = new Question({
            description,
            option1,
            option2,
            ownerUsername: username,
            owner: user_id,
            anonymous, 
        });

        const savedQuestion = await newQuestion.save();

        const user = await User.findById(user_id);
        user.questions.push(savedQuestion._id);
        await user.save();

        response.status(201).json(savedQuestion);
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

router.get("/latestsquestions", async (request, response) => {
    try{
        const user_id = request.body.user_id;

        const user = await User.findById(user_id).select('votedQuestions').exec();
        const votedQuestionIds = user.votedQuestions;
        
        const questions = await Question.find({_id: { $nin: votedQuestionIds }})
            .sort({createdAt: -1})
            .limit(20);
        
        return response.status(200).json(questions);
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

router.get("/randomquestions", async (request, response) => {
    try{
        const user_id = request.body.user_id;

        const user = await User.findById(user_id).select('votedQuestions').exec();
        const votedQuestionIds = user.votedQuestions;
        
        const questions = await Question.aggregate([
            { $match: { _id: { $nin: votedQuestionIds } } },
            { $sample: { size: 20 } }
        ]);
        response.status(200).json(questions);
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

router.get("/myquestions", async (request, response) => {
    try {
        const user_id = request.body.user_id;

        const user = await User.findById(user_id).populate('votedQuestions').exec();

        return response.status(200).json(user.votedQuestions);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

export default router;