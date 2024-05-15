import mongoose, { Mongoose } from "mongoose";

const questionSchema = mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        option1:{
            type: String,
            required: true
        },
        option2:{
            type: String,
            required: true
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        anonymous:{
            type: Boolean,
            required: true,
            default: false
        }
    }
)

export const Question = mongoose.model("Question", questionSchema);