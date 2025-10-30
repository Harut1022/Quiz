import express from "express"
import { checkRole } from "../middlewares/checkRole.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import question from "../controllers/question.js"
import { checkQuizExists } from "../middlewares/checkQuizExists.js"
import { upload } from "../helpers/upload.js"

export const questionRouter = express.Router()
questionRouter.use(isAuthenticated)


questionRouter.post("/add/:id", 
    checkRole("creator","admin"),
    checkQuizExists,
    upload.single("image"),
    question.addQuestion)

