import multer from "multer"
import { v4 as uuidv4 } from "uuid";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ստուգում ենք route-ը կամ ֆայլի դաշտի անունը
        if (req.originalUrl.includes("profile")) {
            cb(null, "public/uploads/profile/");
        } else if (req.originalUrl.includes("quiz")) {
            cb(null, "public/uploads/quizzes/");
        } else {
            cb(null, "public/uploads/");
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + uuidv4() + file.originalname);
    }
})

export const upload = multer({ storage })


//AWS S3
