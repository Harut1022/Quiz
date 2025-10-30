import express from "express"
import quiz from "../controllers/quiz.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { checkRole } from "../middlewares/checkRole.js"




export const quizRouter = express.Router()
quizRouter.use(isAuthenticated)


// Ավելացնենք quiz 
quizRouter.post("/add",checkRole("creator","admin"), quiz.createQuiz)
quizRouter.patch("/edit/:id", checkRole("creator","admin"),quiz.editQuiz)
quizRouter.put("/hashtag/add/:id",checkRole("creator","admin"),quiz.addHashtag)


