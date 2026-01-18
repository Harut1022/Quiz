import express from "express"
import { checkRole } from "../middlewares/checkRole.js"

import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import question from "../controllers/question.js"
import middlewareQuiz from "../middlewares/Quiz.js"
import { upload } from "../helpers/upload.js"
import answer from "../middlewares/Answer.js"

export const questionRouter = express.Router()
questionRouter.use(isAuthenticated)
questionRouter.use(checkRole("creator","admin"))


questionRouter.post("/add/:id", 
    middlewareQuiz.checkQuizExists,
    upload.single("image"),
    question.addQuestion)
questionRouter.patch("/edit/:id",upload.single("image"),question.editQuestion)
questionRouter.delete("/delete/:id",question.deleteQuestion)




//answer 
questionRouter.post("/answer/add/:id",upload.single("answerImage"),answer.checkAdd, question.addAnswer)
questionRouter.put("/answer/edit/:id",upload.single("answerImage"),answer.checkEdit,question.editAnswer)
questionRouter.patch("/answer/edit/:id",upload.single("answerImage"),question.editAnswers)

questionRouter.delete("/answer/delete/:id",upload.single("answerImage"),question.deleteAnswer)


