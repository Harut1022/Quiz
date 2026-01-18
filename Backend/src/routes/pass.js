import express from "express" 
import pass from "../controllers/pass.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import middlewareQuiz from "../middlewares/Quiz.js"
import middlewareAttempt from "../middlewares/Attempt.js"


export const passRouter = express.Router()
passRouter.use(isAuthenticated)

//ստանանք բոլոր փորձերը quiz անցնելու։ 
passRouter.get("/",pass.allAttempts)
passRouter.get("/:id",pass.getAttemptsById)
passRouter.post("/:id",
    middlewareAttempt.checkAvailability,
    middlewareQuiz.getQuiz,
    pass.passingQuiz
)

//ստանանք quiz-ը անցնելու հարցերի քանակները  
passRouter.get("/quiz/:id/quotes",pass.getQuotesQuiz)

//ուղարկենք ID և հարցի քանակը որ ստանանք quiz-ը անցնելու համար
passRouter.get("/quiz/:id",pass.quizById)


