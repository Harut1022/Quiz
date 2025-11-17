import { Schema, model,Types } from "mongoose"; 


export const answerSchema = new Schema({
    text: {type:String,required: true},
    isCorrect: {type:Boolean, default: false }, 
    picture: {type: String}
})



