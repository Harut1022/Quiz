import express from 'express'
const app = express()
const port = 4003



app.listen(port,()=>console.log(`http://localhost:${port}`))