import { Attempt } from "../models/index.js"

class AttemptMiddleware {
    async checkAvailability(req,res,next){
        try{
            const {id} = req.params 
            const attempt = await Attempt.findById(id) 
            if(attempt.isFinished) return res.status(403).send({message: "This quiz attempt is already finished."})
            next()
        }catch(err){
            return res.status(500).send({message: err.message})
        }
    }
}


export default new AttemptMiddleware()