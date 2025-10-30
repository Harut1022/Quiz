import jwt from "jsonwebtoken"

export const checkRole = (...allowedroles) =>{
    return async (req, res, next) => {
        if(!req.user) return res.status(401).send({message: "Unauthorized"})
        try {
            const { user } = req
            if (!allowedroles.includes(user.role)) {
                return res.status(403).send({message:"Access denied"})
            }

            next()

        } catch (err) {
            return res.status(400).send({message: err.message})
        }

    }


}