import { Quiz } from "../models/index.js"
import { Types } from "mongoose";
class PassController {
    async getQuotesQuiz(req, res) {
        // params: QuizId 
        try {
            const { id } = req.params
            const { _id: authorId } = req.user

            //գտնենք quiz-ը և հետ ուղարկենք այն հարցերի քանակը որոնցով կարող ենք անցնել այս թեսթը 
            const quotes = await Quiz.findById(id).select("questionCounts")
            if (!quotes) return res.status(404).send({ message: "Quiz not found or access denied." })

            return res.status(200).send({
                message: "Quiz question count retrieved successfully.",
                questionCounts: quotes
            })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված

    async quizById(req, res) {
        // params: quizId 
        // body: quotes
        try {
            const { id: quizId } = req.params
            const quotes = Number(req.body.quotes)

            const checkQuiz = await Quiz.findOne({ _id: quizId })
            if (!checkQuiz) return res.status(404).send({ message: "Quiz not found." })

            if (!checkQuiz.questionCounts.includes(quotes))
                return res.status(400).send({ message: "Invalid question count value." })

            const [quiz] = await Quiz.aggregate([
                { $match: { _id: Types.ObjectId.createFromHexString(quizId) } },
                {
                    $lookup: {
                        from: "questions", // երկրորդ հավաքածուի անունը
                        localField: "_id", // Quiz-ում օգտագործվող դաշտը
                        foreignField: "quizId", // Questions-ում կապվող դաշտը
                        as: "questions",
                        pipeline: [
                            { $sample: { size: quotes } },
                            { $unset: "answers.isCorrect" }
                        ]

                    } // անունը նոր դաշտի համար
                },
            ])

            if (!quiz)
                return res.status(404).send({ message: "Quiz not found or no questions available." });

            return res.status(200).send({ message: quiz })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }// ստուգված 

    async passingQuiz(req,res){
        //req.params = quizId 
        // req.user = userId 
        // req.body [{questionId, selectedAnswers:[_id]}]
        try{
            const [answers] = req.body
            res.send({message: answers})
        }catch(err){

        }
    }
};

export default new PassController()