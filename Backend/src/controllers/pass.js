import { correctAnswers } from "../helpers/passing/correctAnswers.js";
import { evaluateQuestion } from "../helpers/passing/evaluateAnswers.js";
import attempt from "../models/attempt.js";
import { Attempt, Quiz } from "../models/index.js"
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
            const { id: userId } = req.user
            const quotes = Number(req.body.quotes)

            const [quiz] = await Quiz.aggregate([
                { $match: { _id: Types.ObjectId.createFromHexString(quizId) } },
                {
                    $lookup: {
                        from: "questions", // երկրորդ հավաքածուի անունը
                        localField: "_id", // Quiz-ում օգտագործվող դաշտը
                        foreignField: "quizId", // Questions-ում կապվող դաշտը
                        as: "questions",
                        pipeline: [
                            { $sample: { size: quotes } }
                        ]

                    }
                },
            ])

            if (!quiz)
                return res.status(404).send({ message: "Quiz not found or no questions available." });

            if (!quiz.questionCounts.includes(quotes))
                return res.status(400).send({ message: "Invalid question count value." })

            const result = {
                userId,
                quizId,
                selectedAnswers: [],
                correctAnswers: correctAnswers(quiz.questions),
            }

            const attempt = await Attempt.create(result)
            for (let question of quiz.questions) {
                question.answers = question.answers.map(answer => {
                    const { isCorrect, ...rest } = answer
                    return rest
                })
            }


            return res.status(200).send({
                message: "Quiz loaded successfully. You may proceed with the attempt.",
                attempt: { _id: attempt._id, quiz }
            })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }// ստուգված 

    async allAttempts(req, res) {
        try{   
            const { _id: userId } = req.user 
            // Գտնում ենք տվյալ user-ի բոլոր Attempt-ները
            const Attempts = await Attempt.find({userId})
            // Եթե Attempt-ների ցանկը դատարկ է
            if(!Attempts.length) return res.status(404).send({message: "No attempts found for this user."})

            // Վերադարձնում ենք բոլոր Attempt-ները
            res.status(200).send({message: "All attempts retrieved successfully.", Attempts})
        }catch(err){
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված 
    async getAttemptsById(req,res){
        try{
            const {id} = req.params
            const {_id:userId} = req.user

            const attempt = await Attempt.findOne({_id:id,userId})

            
            res.send({})
        }catch(err){
            return res.status(500).send({message: err.message})
        }
    }

    async passingQuiz(req, res) {
        //req.params = attemptId 
        // req.user = userId 
        // req.body {quizId, selectedAnswers: [{questionId,answerIds:[]}]}
        try {
            const {selectedAnswers } = req.body
            const {_id:quizId} = req.quiz
            const { id: attemptId } = req.params
            const { _id: userId } = req.user

            const attempt = await Attempt.findOne({ _id: attemptId, userId, quizId })
                .populate({
                    path: "correctAnswers.questionId",
                    select: "title image type isShuffle point",
                })
            
            //եթե բոլոր հարցերին չի պատասխանել պահում ենք լրացված տվյալները
            if (selectedAnswers.length !== attempt.correctAnswers.length) {
                const updateAttempt = await Attempt.findOneAndUpdate(
                    { _id: attemptId, userId, quizId },
                    {
                        $set: {
                            selectedAnswers
                        }
                    },
                    {new:true}
                )
                return res.status(200).send({message:"quizը կիսատ է լրացված", attempt: updateAttempt})
            }
            
            //selected answers ու correct answers պետք է լինեն նույն shape-ի 
            const passingScore = evaluateQuestion(attempt.correctAnswers,selectedAnswers) 
            attempt.score = passingScore 
            attempt.isFinished = true 
            attempt.isPassed = attempt.score < req.quiz.passingPercent ? false : true 

            const isSaved = await attempt.save({new:true})
        

            res.status(200).send({ message: "Quiz finished successfully.", Attempt: isSaved })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված 
};

export default new PassController()