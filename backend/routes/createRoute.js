import express from "express";
import { Question } from "../models/questionModel.js";
import multer from "multer";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { User } from "../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const Storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage: Storage
}).array('image', 2);

router.post("/", async (request, response) => {
    try {
        upload(request, response, async (error) => {
            
            if (error) {
                console.error("Upload error:", error);
                return response.status(500).send("Error uploading files");
            }

            if(request.body.user_id === undefined){
                return response.status(400).send("Owner ID required");
            }

            if (request.body.description === '' || ((request.body.option1 === '' || request.body.option2 === '') && request.files.length !== 2)) {
                return response.status(400).send("Need description and, either two options or two images");
            }

            const fileContents = [];

            // Read and encode each file as Base64
            const filePaths = request.files.map(file => file.path);
                
            filePaths.forEach(filePath => {
                try {
                    const data = fs.readFileSync(filePath);
                    const base64String = Buffer.from(data).toString('base64');
                    fileContents.push(base64String);
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error(`Error reading file ${filePath}:`, err);
                } 
            })

            const newQuestion = new Question({
                description: request.body.description,
                option1: request.body.option1 || null,
                option2: request.body.option2 || null,
                image1: fileContents[0] || null,
                image2: fileContents[1] || null,
                owner: request.body.user_id,
                anonymous: request.body.anonymous || false,
                ownerUsername: request.body.username
            });

            await newQuestion.save();

            const user = await User.findById(request.body.user_id);
            user.questions.push(newQuestion._id);
            await user.save();

            response.status(200).send("Question uploaded successfully");
        });
    } catch (error) {
        console.error("Error:", error);
        response.status(500).send("Server error");
    }
});

router.delete("/", async (request, response) => {
    try{
        const { question_id, user_id } = request.body;

        const question = await Question.findById(question_id);

        if(!question){
            return response.status(404).send("Question not found");
        }

        if(question.owner.toString() !== user_id){
            return response.status(401).send("Unauthorized");
        }

        const user = await User.findById(user_id);
        user.questions.pull(question_id);
        await user.save();

        for (const username of question.voted1) {
            const user = await User.findOne({ username });
            if (user) {
                user.votedQuestions.pull(question_id);
                await user.save();
            } else {
                console.warn(`User with username ${username} not found`);
            }
        }

        for (const username of question.voted2) {
            const user = await User.findOne({ username });
            if (user) {
                user.votedQuestions.pull(question_id);
                await user.save();
            } else {
                console.warn(`User with username ${username} not found`);
            }
        }

        await Question.deleteOne({ _id: question_id });

        return response.status(200).send("Question deleted successfully");
    }catch(error){
        console.error("Error:", error);
        response.status(500).send("Server error");
    }
});

export default router;