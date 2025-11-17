import express from "express"
import quiz from "../controllers/quiz.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { checkRole } from "../middlewares/checkRole.js"




export const quizRouter = express.Router()
quizRouter.use(isAuthenticated)
quizRouter.use(checkRole("creator","admin"))

quizRouter.get("/all",quiz.getAll)
quizRouter.post("/add", quiz.createQuiz)
quizRouter.patch("/edit/:id",quiz.editQuiz)
quizRouter.put("/hashtag/add/:id",quiz.addHashtag)
quizRouter.get("/:id",quiz.getById)
quizRouter.put("/:id/toggle-publish",quiz.togglePublish)


