import { User } from '../models/index.js'
export async function isAuthenticated(req, res, next) {
     try {
          const {id} = req.user
          //Check user by ID; if not verified, block access. 
          const user = await User.findById(id)
          if(!user.isVerified) return res.status(400).send({message:"Unverified user."})
          
          next()
     } catch (err) {
          return res.status(500).send({message: err.message})
     }
}// պետքա ստուգել նորմալ 
