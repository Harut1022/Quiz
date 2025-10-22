import express from 'express'
import { env } from './src/config/env.js'
import { userRouter } from './src/routes/user.js'
import { connectDb, disconnectDb } from './src/config/db.js'
const app = express()
const url = env.url
const port = env.port
app.use(express.urlencoded())
app.use(express.json())




app.use("/",userRouter)







app.listen(port,()=>{
    console.log(`${url}:${port}`)
    connectDb()
    console.log("Mongo Connected!")
})


process.on('SIGINT', () => disconnectDb())
process.on('SIGTERM', () => disconnectDb())