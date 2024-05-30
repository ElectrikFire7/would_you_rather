import bcrypt from "bcrypt";
import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

router.post("/signin", async (request, response) => {
    //route for user to sign up
    try{
        if(!request.body.username || !request.body.password){
            return response.status(400).send({message: 'Send all required fields'})
        }

        const { username, password } = request.body

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return response.status(400).send({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: request.body.username,
            password: hashedPassword,
        }

        const user = await User.create(newUser);
        console.log("new user created");

        return response.status(201).send({ username: user.username, userId: user._id  });
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

router.post("/login", async (request, response) =>{
    //route for user to login
    try{
        const { username, password } = request.body;

        const user = await User.findOne({ username });

        if (!user) {
            return response.status(404).send({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return response.status(401).json({ error: "Incorrect password" });
        }

        return response.status(200).send({ username: user.username, userId: user._id  });
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send(error.message);
    }
});

export default router;