import { Quiz } from "../models/index.js";
// խնդիրներ կան սա մենակ ստուգում է կա թե ոչ 
// արդյոք քուիզը տվյալ օգտատիրոջն է ով ստեղծել է 

export const checkQuizExists = async (req, res, next) => {
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