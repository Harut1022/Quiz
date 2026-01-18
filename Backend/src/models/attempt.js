import { Schema, model, Types } from "mongoose";

const AttemptSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    quizId: { type: Types.ObjectId, ref: "Quiz", required: true },
    selectedAnswers: [
        {
            _id:false,
            questionId: {type: Types.ObjectId,ref: "Question"},
            answerIds: [{type: Types.ObjectId, ref: "Answer"}]
        }
    ],
    correctAnswers: [
        {
            _id:false,
            questionId: {type: Types.ObjectId,ref: "Question"},
            answerIds: [{type: Types.ObjectId, ref: "Answer"}]
        }
    ],
    score: { type: Number, default: 0 },
    isFinished: { type: Boolean, default: false },
    isPassed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    finishedAt: Date,

}, { timestamps: true })


export default model("Attempt", AttemptSchema)