import express from 'express'
import { env } from './src/config/env.js'
import { userRouter } from './src/routes/user.js'
import { quizRouter } from './src/routes/quiz.js'
import { connectDb, disconnectDb } from './src/config/db.js'
import { setupSwagger } from './src/helpers/swagger.js';
import { questionRouter } from './src/routes/question.js'
import { passRouter } from './src/routes/pass.js'


const app = express()
setupSwagger(app);
app.use(express.urlencoded())
app.use(express.json())


app.use("/",userRouter)
app.use("/quiz/question",questionRouter)
app.use("/quiz",quizRouter)
app.use("/pass",passRouter)


const HOST = "0.0.0.0"; // սա թույլ տալիս է ընդունել բոլալ IP-ներից
app.listen(env.port,HOST,()=>{
    console.log(`${env.url}:${env.port}`)
    connectDb()
    console.log("Mongo Connected!")
})


process.on('SIGINT', () => disconnectDb())
process.on('SIGTERM', () => disconnectDb())