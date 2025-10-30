import express from 'express'
import { env } from './src/config/env.js'
import { userRouter } from './src/routes/user.js'
import { quizRouter } from './src/routes/quiz.js'
import { connectDb, disconnectDb } from './src/config/db.js'
import { setupSwagger } from './src/helpers/swagger.js';
import { questionRouter } from './src/routes/question.js'


const app = express()
setupSwagger(app);
app.use(express.urlencoded())
app.use(express.json())


app.use("/",userRouter)
app.use("/quiz",quizRouter)
app.use("/quiz/question",questionRouter)


app.listen(env.port,()=>{
    console.log(`${env.url}:${env.port}`)
    connectDb()
    console.log("Mongo Connected!")
})


process.on('SIGINT', () => disconnectDb())
process.on('SIGTERM', () => disconnectDb())