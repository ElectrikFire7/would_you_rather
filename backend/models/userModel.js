import mongoose, { Mongoose } from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        rVotePoints:{
            type: Number,
            default: 0
        },
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        votedQuestions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }]
    }
)

export const User = mongoose.model("User", userSchema);