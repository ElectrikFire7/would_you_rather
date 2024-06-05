import mongoose, { Mongoose } from "mongoose";

const questionSchema = mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        option1:{
            type: String,
        },
        option2:{
            type: String,
        },
        ownerUsername:{
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
        },
        voted1:[{
            type: String,
        }],
        voted2:[{
            type: String,
        }],
        image1:{
            type: String,
        },
        image2:{
            type: String,
        }        
    },
    {
        timestamps: true
    }
);

questionSchema.index({ createdAt: -1 });

export const Question = mongoose.model("Question", questionSchema);