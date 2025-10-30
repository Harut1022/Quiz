import express from "express"
import userController from "../controllers/user.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { upload } from "../helpers/upload.js"

export const userRouter = express.Router()

//Վերիֆիկացիան անցնելու համար։ 
userRouter.get("/verify/:key",userController.verificationAccept)



userRouter.post("/signup", userController.signup)
userRouter.post("/login",userController.login)


userRouter.use(isAuthenticated)
userRouter.get("/profile",userController.getProfile)
userRouter.post("/profile/verify",userController.verificationSend)
userRouter.put("/profile",userController.updateUser)
userRouter.patch("/profile/upload",upload.single("picture"),userController.uploadAvatar)



