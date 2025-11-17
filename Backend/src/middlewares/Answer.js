import { Question } from "../models/index.js"

class Answer {
    async checkAdd(req, res, next) {
        // req.body {
        // text:String
        // isCorrect:Boolean 
        // imageAnswer: String 
        // }
        //պետք է ստուգել եթե true արդեն կա չթողնել ավելացնի 
        try {
            const { id: questionId } = req.params
            const { isCorrect } = req.body
            const isCorrectBool = String(isCorrect).toLowerCase() === "true";
            const question = await Question.findById(questionId)
            
            if (!question) return res.status(404).send({ message: "Question not found" });
            const countIsCorrect = question.answers.filter(a => a.isCorrect).length

            if (question.type === "single" && countIsCorrect >= 1 && Boolean(isCorrectBool) === true)
                return res.status(409).send({ message: "Single-type questions can only have one correct answer." })
            
            req.body.isCorrect = isCorrectBool
            next()
        }catch(err){
            return res.status(500).send({message:err.message})
        }

    }
    async checkEdit(req, res, next) {
        // req.body {
        // isCorrect:Boolean    
        // quizId:ObjectId ref Quiz
        // text:String
        // questionId:ObjectId ref Quiz
        // }
        //պետք է ստուգել եթե true արդեն կա չթողնել ուրիշ պատասխան փոխի true 
        try {
            const { id: answerId } = req.params
            const { quizId,questionId } = req.body
            let {isCorrect} =req.body
            //ստուգում ենք ստացված isCorrect ը true է թե false 
            isCorrect = String(isCorrect).toLowerCase() === "true"
            //գտնում ենք մեր question-ը 
            const question = await Question.findOne({_id:questionId})
            //հաշվում ենք քանի հատ true ունենք առանց նոր փոփոխվող answer-ի             
            const countIsCorrect = question.answers.filter(answer => answer.isCorrect && answer._id != answerId ).length
            if(question.type === "single" && countIsCorrect > 0 && isCorrect)
                return res.send({message:"Single-type questions can only have one correct answer."})

            if(question.type === "multiple" && countIsCorrect == 0 && !isCorrect)
                return res.status(409).send({message: "At least two answers must be marked as true for this question type."})


            next()
        }catch(err){
            return res.status(500).send({message:err.message})
        }
    }
}

export default new Answer() 