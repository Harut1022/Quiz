import {Quiz} from "../models/index.js";

class QuizMiddleware{
    async getQuiz (req, res, next){
        try {
            const { quizId:_id } = req.body
            if (!_id) return res.status(400).send({ message: "Quiz ID is required" });
            const quiz = await Quiz.findById(_id);
            if (!quiz) return res.status(404).send({ message: "Quiz not found" });
            req.quiz = quiz; // եթե պետք լինի օգտագործել controller-ում
            next();
    
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    }

    async checkQuizExists (req, res, next) {
        try {
    
            const { id } = req.params
            if (!id) return res.status(400).send({ message: "Quiz ID is required" });
            const quiz = await Quiz.findById({_id:id});
            if (!quiz) return res.status(404).send({ message: "Quiz not found" });
            req.quiz = quiz; // եթե պետք լինի օգտագործել controller-ում
            next();
    
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    
    }
}


export default  new QuizMiddleware() 