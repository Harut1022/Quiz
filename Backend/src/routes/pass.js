import express from "express" 
import pass from "../controllers/pass.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"

export const passRouter = express.Router()
passRouter.use(isAuthenticated)


//ստանանք quiz-ը անցնելու հարցերի քանակները  
passRouter.get("/quiz/:id/quotes",pass.getQuotesQuiz)

//ուղարկենք ID և հարցի քանակը որ ստանանք quiz-ը անցնելու համար

passRouter.get("/quiz/:id",pass.quizById)

passRouter.post("/quiz/:id",pass.passingQuiz)