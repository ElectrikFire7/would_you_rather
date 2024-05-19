import express from "express";
import { User } from "../models/userModel.js";
import { Question } from "../models/questionModel.js";

const router = express.Router();

router.put("/", async (request, response) => {
    try{
        const { question_id, option, user_id, username } = request.body;

        const question = await Question.findById(question_id);

        if(!question){
            return response.status(404).send("Question not found");
        }

        let alreadyVoted = false;

        if(option === 1){
            if(question.voted2.includes(username)){
                question.voted2.pull(username);
                alreadyVoted = true;
            }
            else if(question.voted1.includes(username)){
                return response.status(200).send("You have already voted for this option");
            }

            question.voted1.push(username);
        }

        else if(option === 2){
            if(question.voted1.includes(username)){
                question.voted1.pull(username);
                alreadyVoted = true;
            }
            else if(question.voted2.includes(username)){
                return response.status(200).send("You have already voted for this option");
            }

            question.voted2.push(username);
        }

        await question.save();

        if(!alreadyVoted){
            const user = await User.findById(user_id);
            user.votedQuestions.push(question_id);
            await user.save();
        }

        return response.status(200).send("Voted successfully");

    }catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

export default router;