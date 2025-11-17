import { Question, Quiz } from "../models/index.js"
import quiz from "./quiz.js"

class QuestionController {
    async addQuestion(req, res) { // title: ,image:,answers:[answerSchema] type, isShuffle, point: 
        try {
            const { id } = req.params // quizId 
            let { title, answers, type, isShuffle, point } = req.body
            const { id: authorId } = req.user
            if (!title) return res.status(400).send({ message: "Title field required" })
            //եթե պատասխաններրը չենք ստացել թող լինի դատարկ զանգված 
            answers = !answers?.length ? [] : answers
            // question օբյեկտը ստեղծենք որ ուղարկենք DB 
            const question = await Question.create({
                title,
                image: req?.file?.filename ? req.file.destination + req.file.filename : "",
                answers,
                quizId: id,
                type,
                isShuffle,
                point,
                authorId
            })
            //quiz ի questions զանգվածի մեջ ավելացնենք նոր id-ն 
            const quiz = await Quiz.findOneAndUpdate(
                { _id: id, authorId },                                 // փնտրում է ըստ _id-ի
                { $push: { questions: question._id } },    // ավելացնում է questions դաշտի զանգվածի մեջ
                { new: true }                       // վերադարձնում է թարմացված post-ը
            ).populate("questions");

            return res.status(200).send({
                message: "Question added successfully.",
                quiz
            })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված
    async editQuestion(req, res) { // title: , quizId, image:,answers:[answerSchema] type, isShuffle, point: 
        try {
            const { id } = req.params // questionId 
            let { title, answers, type, isShuffle, point, quizId } = req.body
            const { id: authorId } = req.user

            // title և quizId պետք է պարտադիր լինեն
            if (!title || !quizId) return res.status(400).send({ message: "Title and quizId field required" })
            //եթե պատասխաններրը չենք ստացել թող լինի դատարկ զանգված 
            answers = !answers?.length ? [] : answers
            // question օբյեկտը ստեղծենք որ ուղարկենք DB 
            const updatedQuestion = await Question.findOneAndUpdate(
                { _id: id, quizId, authorId },
                {
                    $set: {
                        title, image: req?.file?.filename ? req.file.destination + req.file.filename : "",
                        answers, type, isShuffle, point
                    }
                },
                { new: true }
            )
            if (!updatedQuestion)
                return res.status(400).send({
                    message: "Question not found or does not belong to the specified quiz."
                })
            return res.status(200).send({
                message: "Question updated successfully.",
                Question: updatedQuestion
            });
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված
    async deleteQuestion(req, res) { // params = id body = quizId
        try {
            let { id: questionId } = req.params
            let { quizId } = req.body
            let { id: userId } = req.user
            const deletedQuestion = await Question.deleteOne({ _id: questionId, quizId })
            if (deletedQuestion.deletedCount == 0)
                return res.status(400).send({ message: "Question not found in the specified quiz." })

            const updatedQuiz = await Quiz.findOneAndUpdate(
                { _id: quizId, authorId: userId },
                { $pull: { questions: questionId } },
                { new: true }
            ).populate("questions")
            if (!updatedQuiz) return res.status(400).send({ message: "Quiz not found or question ID is invalid." })
            return res.status(200).send({ success: true, message: "Question deleted successfully." })

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված 


    async addAnswer(req, res) { // multipart/form-data → fields: text, isCorrect, quizId, (optional) file
        try {
            const { id: questionId } = req.params
            let { text, isCorrect = false, quizId } = req.body
            const { id: authorId } = req.user
            if (!text.trim() && !req.file)
                return res.status(400).send({ message: "Answer text or image is required." });
            const picture = req?.file?.filename ? req.file.destination + req.file.filename : ""
            const question = await Question.findOneAndUpdate({ _id: questionId, quizId, authorId },
                { $push: { answers: { text, isCorrect, picture } } },
                { new: true }
            )

            if (!question)
                return res.status(404).send({ message: "Question not found or quizId is invalid." });


            return res.status(201).send({ message: "Answer added successfully.", question })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված 

    async editAnswer(req, res) {
        try {
            // params: answerId 
            // body: Multipart form data: text, isCorrect ,questionId,quizId,answerImage
            const { id: answerId } = req.params
            let { text, isCorrect, questionId, quizId } = req.body
            const { id: authorId } = req.user
            if (!text.trim() && !req.file)
                return res.status(400).send({ message: "Answer text or image is required." });
            const picture = req?.file?.filename ? req.file.destination + req.file.filename : ""
            const question = await Question.findOneAndUpdate(
                { _id: questionId, authorId, quizId, "answers._id": answerId },
                {
                    $set: {
                        "answers.$.text": text,
                        "answers.$.isCorrect": isCorrect,
                        "answers.$.picture": picture
                    }
                },
                { new: true }
            )
            if (!question) return res.status(404).send({ message: "The specified answer was not found." })

            res.status(200).send({ message: "Answer updated successfully.", question })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված 

    async editAnswers(req, res) {
        try {
            // params: questionId
            // body: Multipart form data: answers:[{text,isCorrect,answersImage}], quizId
            return res.status(200).send({message: "Դեռ հստակ չի վերանայել է պետք "})
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//խնդիր կա 
 

    async deleteAnswer(req, res) {
        try {
            //req.params answerId 
            //req.body quizId,questionId 
            const { id: answerId } = req.params
            const { quizId, questionId } = req.body
            const { id: authorId } = req.user

            const question = await Question.findOneAndUpdate(
                { _id: questionId, quizId, authorId, "answers._id":answerId},
                { $pull: { answers: { _id: answerId} } },
                { new: true }
            )
            if (!question) return res.status(404).send({ message: "The specified answer was not found." })
            return res.status(200).send({message:"This Answer deleted succsesfully", question})
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված  


}


export default new QuestionController() 