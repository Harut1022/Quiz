import express from "express"
import userController from "../controllers/user.js"

export const userRouter = express.Router()


userRouter.post("/signup", userController.signup)
// userRouter.get("/login",()=>console.log("login"))