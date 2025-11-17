import { Schema, model,Types } from "mongoose";



const AttemptSchema = new Schema({
    userId:{type: Types.ObjectId, ref: "User", required: true},
    quizId:{type: Types.ObjectId, ref: "Quiz", required:true},

    score: { type: Number, default: 0},
    isPassed: {type:Boolean,default: false},
    startedAt: { type: Date, default: Date.now }
})


export default model("Attempt", AttemptSchema)