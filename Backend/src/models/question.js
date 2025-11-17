import { Schema, model, Types } from "mongoose";
import { answerSchema } from "./answer.js";
import { Quiz, User } from "./index.js";



export const questionSchema = new Schema({
    title: { type: String },
    image: { type: String },
    type: { type: String },
    quizId: { type: Types.ObjectId, ref: Quiz },
    isShuffle: { type: Boolean, default: true },
    point: { type: Number, default: 1 },
    answers: [answerSchema],
    authorId: {type: Types.ObjectId, ref: User}
})


export default model("Question", questionSchema)