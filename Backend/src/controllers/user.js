import { User } from "../models/index.js"

class UserController {
    getAll() {

    }
    getById() {

    }
    //սկբնական գրանցում 
    async signup(req, res) { // username, password,repassword 
        try {
            const { username, password, repassword } = req.body
            // ստուգում ենք որպեսզի դաշտերը դատարկ չլինեն
            if (!username.trim() || !password.trim() || !repassword.trim())
                return res.status(400).send({ message: "All fields are required." })

            //ստուգում ենք որ երկու գաղտնաբառերը նույնը լինեն 
            if (password !== repassword)
                return res.status(400).send({ message: "Passwords do not match." })

            //Գրանցենք ակկաունտը 
            const user = await User.create({ username, password })
            res.send({message: "Registration has been successfully completed."})
        } catch (err) {
            res.send({ message: err.message })
        }


    }
    //տվյալների ամբոողջական գրանցում 
    async updateUser(req,res){


    }

    async verificationSendUser(req,res){ 
        
    }
    async verificationAceptUser(req,res){

    }
    edit() {

    }

}


export default new UserController() 