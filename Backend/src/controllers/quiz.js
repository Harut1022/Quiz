import { Quiz } from "../models/index.js"

class QuizController {
    async createQuiz(req, res) { //multipart form data
        // title,description,image,category,authorId,isShuffle
        // passingPercent, hashtags, questions, isPublished, difficulty ,questionCounts 
        try {

            //պարտադիր դաշտերը
            let { title, description, category } = req.body
            // ստուգում ենք տվյալ դաշտերից ոչ մեկ չպետք է լինի դատարկ։
            if (!title?.trim() || !description?.trim() || !category?.trim())
                return res.status(400).send({ message: "Please fill in all required fields correctly." })
            //երկրորդային դաշտերը 
            let { isShuffle, passingPercent, hashtags, questions, isPublished, difficulty, questionCounts } = req.body
            let image = req?.file?.filename ? req.file.destination + req.file.filename : ""
            let authorId = req.user._id

            //փոխենք թվային զանգված ապահովության համար։
            questionCounts = questionCounts.map(elm => +elm)

            //ստեղծենք quiz-ի օբյեկտը որ ուղարկենք DB 
            const quiz = {
                title, description, category,
                isShuffle, passingPercent, authorId,
                hashtags, questions, isPublished, difficulty, questionCounts
            }
            const savedQuiz = await Quiz.create(quiz)

            res.status(200).send({ ok: true, quiz: savedQuiz })
            //ուղարկում ենք ամբողջ quiz ը որպես պատասխան 
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    }//ստուգված 

    async editQuiz(req, res) { //multipart form data
        // title,description,image,category,authorId,isShuffle
        // passingPercent, hashtags, questions, isPublished, difficulty ,questionCounts 

        try {
            //պարտադիր դաշտերը
            let { title, description, category } = req.body
            // ստուգում ենք տվյալ դաշտերից ոչ մեկ չպետք է լինի դատարկ։
            if (!title?.trim() || !description?.trim() || !category?.trim())
                return res.status(400).send({ message: "Please fill in all required fields correctly." })
            //երկրորդային դաշտերը 
            let { isShuffle, passingPercent, hashtags, questions, isPublished, difficulty, questionCounts } = req.body
            let image = req?.file?.filename ? req.file.destination + req.file.filename : ""
            let authorId = req.user._id
            //ստեղծենք quiz-ի օբյեկտը որ ուղարկենք DB 

            const quiz = {
                id: req.params.id, title, description, category,
                isShuffle, passingPercent, authorId,
                hashtags, questions, isPublished, difficulty, questionCounts
            }
            const updatedQuiz = await Quiz.findOneAndUpdate({ _id: quiz.id, authorId}, 
                {$set:{...quiz}},
                {new: true}
            ).populate("questions")
            if (updatedQuiz.matchedCount === 0) return res.status(400).send({ message: "Nothing to update" })
            res.status(200).send({ ok: true, updatedQuiz })
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }

    }//ստուգված

    async getAll(req, res) {
        try {
            const { id } = req.user
            const quizes = await Quiz.find({ authorId: id })
            if (quizes.length === 0)
                return res.status(404).send({
                    message: "No quizzes found for this user.",
                    data: quizes
                })

            return res.status(200).send({
                message: "All quizzes created by this user.",
                count: quizes.length,
                quizes
            })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }//ստուգված

    async getById(req, res) {// Quiz id 
        //վերադարձնում ենք Quiz ը ըստ ID-ի և տվյալ userId-ի
        try {
            const { id } = req.params
            const { id: userId } = req.user
            const quiz = await Quiz.findOne({ _id: id, authorId: userId }).populate("questions")
            if (!quiz) return res.status(404).send({ message: "Quiz not found." })
            return res.status(200).send({
                message: "Quiz found successfully.",
                data: quiz
            })//IQuiz type 
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }

    }//ստուգված 

    async togglePublish(req, res) { // Quiz id 
        try {
            // Վերցնում ենք quiz-ի ID-ն request-ի params-ից և user-ի ID-ն JWT-ից
            const { id: quizId } = req.params
            const { id: userId } = req.user

            // Փնտրում ենք տվյալ user-ին պատկանող quiz-ը
            const quiz = await Quiz.findOne({ _id: quizId, authorId: userId })
            if (!quiz) return res.status(404).send({ message: "Quiz not found." })
            // Փոխում ենք publish-ի վիճակը հակառակ արժեքի (true ↔ false)
            quiz.isPublished = !quiz.isPublished
             // Պահպանում ենք փոփոխված quiz-ը տվյալների բազայում
            await quiz.save()

            // Վերադարձնում ենք նոր publish-ի վիճակը և հաղորդագրությունը
            return res.status(200).send({
                message: `Quiz ${quiz.isPublished ? "published" : "unpublished"} successfully.`,
                isPublished: quiz.isPublished
            });
        } catch (err) {
            return res.send({ message: err.message })
        }

    }//ստուգված

    async addHashtag(req, res) { // hashtag
        try {
            const { id } = req.params
            const { hashtag } = req.body;
            //եթե հետագայում պետք լինի ավելացնենք ստուգում 
            // որ նույն hashtag ի դեպքում ոչինչն չավելացնի 
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
    }//ստուգված 
    
}

export default new QuizController() 