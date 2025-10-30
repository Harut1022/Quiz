import {Quiz} from "../models/index.js"

class QuizController {
    async createQuiz(req, res) { // title,description,image,category,authorId,isShuffle
        // passingPercent, hashtags, questions, isPublished, difficulty ,questionCounts 
        try {
            const quiz = { ...req.body }

            // ստուգում ենք տվյալ դաշտերից ոչ մեկ չպետք է լինի դատարկ։
            if (!quiz.title?.trim() || !quiz.description?.trim() || !quiz.category?.trim())
                return res.status(400).send({ message: "Please fill in all required fields correctly." })
            quiz.authorId = req.user._id
            const savedQuiz = await Quiz.create(quiz)

            res.status(200).send({ ok: true, quizId: savedQuiz.id })
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }

    }
    async editQuiz(req, res) { //կարգի բերել

        //title description,image,category,authorId,isShuffle
        // passingPercent, hashtags, questions, isPublished, difficulty
        try {
            const quiz = { ...req.body }
            quiz.id = req.params.id

            // ստուգում ենք տվյալ դաշտերից ոչ մեկ չպետք է լինի դատարկ։
            if (!quiz.title?.trim() || !quiz.description?.trim() || !quiz.category?.trim())
                return res.status(400).send({ message: "Please fill in all required fields correctly." })

            quiz.authorId = req.user._id

            const updatedQuiz = await Quiz.updateOne({ _id: quiz.id }, quiz)

            res.status(200).send({ ok: true })
        } catch (err) {
           return res.status(500).send({ message: err.message });
        }

    }
    async addHashtag(req, res) { // hashtag
        try {
            const { id } = req.params
            const { hashtag } = req.body; 

            const updatedQuiz = await Quiz.findByIdAndUpdate(
                id,                                 // փնտրում է ըստ _id-ի
                { $push: { hashtags: hashtag } },    // ավելացնում է hashtags դաշտի զանգվածի մեջ
                { new: true }                       // վերադարձնում է թարմացված post-ը
            );
            if (!updatedQuiz) {
                return res.status(404).send({ message: "Quiz not found" });
            }
            res.status(200).send({
                message: "Hashtag added successfully",
                post: updatedQuiz,
            });
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    }
    

}

export default new QuizController() 