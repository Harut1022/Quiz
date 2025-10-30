import {Question, Quiz} from "../models/index.js"

class QuestionController {
    async addQuestion(req,res){ // title: ,image:,answers:[answerSchema] type, isShuffle, point: 
        const {id} = req.params // quizId 
        let {title,answers,type,isShuffle,point} = req.body

        if(!title) return res.status(400).send({message:"Title field required"})
        //եթե պատասխաններրը չենք ստացել թող լինի դատարկ զանգված 
        answers = !answers ? [] : answers
        // question օբյեկտը ստեղծենք որ ուղարկենք DB 
        const question = await Question.create({
            title,
            image: req.file.destination + req.file.filename,
            answers,
            quizId:id,
            type,
            isShuffle,
            point
        })

        const quiz = await Quiz.findByIdAndUpdate(
                        id,                                 // փնտրում է ըստ _id-ի
                        { $push: { questions: question._id } },    // ավելացնում է hashtags դաշտի զանգվածի մեջ
                        { new: true }                       // վերադարձնում է թարմացված post-ը
                    ).populate("questions");

            console.log(quiz)
        res.send({})
    }
    
    async addAnswer(req,res){ //text, isCorrect 
        const {id:questionId} = req.params 

    }
}


export default new QuestionController() 