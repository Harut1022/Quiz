import { User,Verifcation } from "../models/index.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from "../config/env.js"
import validator from "validator"
import crypto from "crypto"

import { sendMailer } from "../helpers/mailer.js"
import { v4 as uuidv4 } from "uuid";
class UserController {
    //կիսատ է 
    async getProfile(req, res) {
        const { id } = req.user

        const user = await User.findById(id).select("-password")

        if(!user) return res.status(404).send({message:"User not a found"})
        res.status(200).send({message:"User profile loaded successfully" , payload: user})
    }

    //սկբնական գրանցում 
    async signup(req, res) { // username, password,repassword 
        try {
            let { username, password, repassword } = req.body
            // ստուգում ենք որպեսզի դաշտերը դատարկ չլինեն
            if (!username.trim() || !password.trim() || !repassword.trim())
                return res.status(400).send({ message: "All fields are required." })

            //ստուգում ենք որ երկու գաղտնաբառերը նույնը լինեն 
            if (password !== repassword)
                return res.status(400).send({ message: "Passwords do not match." })

            //ստուգենք գաղտնաբառի վալիդացիան 
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`\.]).{8,20}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).send({ message: "Password does not meet the requirements" });
            }


            //գաղտնաբառը հեշավորենք նախքան գրանցելը։ 
            password = await bcrypt.hash(password, 10)


            //Գրանցենք ակկաունտը 
            const user = await User.create({ username, password })
            res.status(201).send({ message: "Registration has been successfully completed." })
        } catch (err) {
            res.status(400).send({ message: err.message })
        }


    }
    //մուտք համակարգ
    async login(req, res) { // username,password,remember
        const { username, password } = req.body
        const expiresIn = req.body.remember? "2d" : "1h";

        if (!username || !password) return res.status(400).send({ message: "Fields are required." })

        //ստուգում ենք user ը կա թե ոչ և գաղտնաբառը ճիշտ է թե ոչ 
        const user = await User.findOne({ username })
        if (!user) return res.status(400).send({ message: "Incorrect username or password." })
        const isCorrect = await bcrypt.compare(password, user.password)
        if (!isCorrect) return res.status(400).send({ message: "Incorrect username or password." })

        //գեներացնենք թոքեն 
        const token = jwt.sign({id: user._id }, env.SECRET, { expiresIn: expiresIn })

        //ուղարկենք թոքենը դեպի ֆրոնտ
        return res.status(200).send({ ok: true, token })

    }

    //Վերիֆիկացման նամակի ուղարկում
    async verificationSend(req, res) { // email 
        try {
            const { username , id } = req.user
            const { email } = req.body

            // ստուգում ենք Email-ը 
            if (!validator.isEmail(email)) return res.status(400).send({ message: "Email is not a valid" })

            //գեներացնում ենք Code-ը verify-ի համար պետք է լինի չկրկնվող
            const key = uuidv4() + "-" +  Date.now()
            
            //պահում ենք տվյալները Verification ում  
            const user = await Verifcation.create({
                userId: id,
                email: email,
                code: key,
                expiresAt: new Date(Date.now() + 20 * 60 * 1000)
            })
            //ուղարկում նամակը և վերադարձնում ենք որ կատարված է։
            await sendMailer(key,username,email)
            return res.status(200).send({ok:true})
        }catch(err){

               res.status(400).send({message:err.message})
        }
       

    }
    //Վերիֆիկացման նամակի հաստատում 
    async verificationAccept(req, res) {
        try{
            const {key} = req.params 
            const verification = await Verifcation.findOne({code:key}) 

            //ստուգում ենք ժամանակը եթե անցել է ասում ենք նորից ուղարկի 
            const isExpired  = Date.now() > verification.expiresAt
            if(isExpired) return res.status(404).send({message: "The verification code has expired."})

            //եթե ժամկետի մեջ է user ին սարքում ենք նույնականացված 
            const user  = await User.updateOne(
                {_id: verification.userId},
                {$set: {isVerified: true,email:verification.email}}
                )
                
                
            //եթե չփոխվեց ոչինչ ուրեմն օգտատերը արդեն նույնականացված է
            if(!user.matchedCount == 0) return res.status(400).send({message:"User is already verified."})
                
            res.status(200).send({ok:true})
        }catch(err){
            res.status(400).send({message: err.message})
        }
        
    }
    //տվյալների ամբոողջական գրանցում 
    async updateUser(req, res) { //{name,surname,phone}
        const {name,surname,phone} = req.body 
        const {id} = req.user
        if (!name || !surname || !phone) return res.status(400).send({ message: "Fields are required." })

        if(!validator.isMobilePhone(phone,"any", { strictMode: true })) return res.status(400).send({ message: "Phone number is not a valid" })
            
        const user = await User.updateOne(
            {_id:id},
            {$set:{name,surname,phone}}
        )

        if(user.matchedCount = 0) return res.status(400).send({message:"No changes were made."})

        res.status(200).send({ok:true})
    }// {status:string,message?:string, payload:string}

    //Պռոֆիլի նկարի ավելացում կամ փոփոխում
    async uploadAvatar(req, res) { // {picture} form data File 
        const {id} = req.user 
        const user  = await User.findById(id)
        user.avatar = req.file.destination + req.file.filename 
        await user.save() 
        res.send({message: user.avatar})
    } // {status:string,message?:string, payload:string}


}


export default new UserController() 