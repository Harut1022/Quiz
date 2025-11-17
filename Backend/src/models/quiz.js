import { Schema, model,Types } from "mongoose";

const quizSchema = new Schema({
    title:{type: String,required:[true,"Title is required"]},
    description:{type:String,required:[true,"Description is required"]},
    image:{type:String},
    category:{type:String},
    difficulty: {type:String,required: [true,"Difficulty level is required"]}, //level
    authorId:{type: Types.ObjectId, ref: "User", required: true},
    isShuffle: { type: Boolean, default: true },
    passingPercent: {type: Number,required: true ,min: 0,max: 100,default: 60 },
    hashtags: [{type:String}],
    questions:[{type: Types.ObjectId, ref:"Question"}],
    isPublished: {type:Boolean, default: false},
    questionCounts: {type: [Number], validate: {
      validator: function (arr) {
        return arr.every(num => Number.isInteger(num) && num > 0);
      },
      message: "All question counts must be positive integers."
    },},

})




export default model("Quiz", quizSchema)