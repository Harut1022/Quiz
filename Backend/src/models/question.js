import { Schema, model,Types } from "mongoose"; 
import { answerSchema } from "./answer.js";
import { Quiz } from "./index.js";



const questionSchema = new Schema({
    title: {type:String},
    image: {type:String}, 
    answers:[answerSchema],
    type: {type:String},
    quizId: {type:Types.ObjectId, ref: Quiz},
    isShuffle: { type: Boolean, default: false }, 
    point: {type:Number, required: true },

})


export default model("Question", questionSchema)