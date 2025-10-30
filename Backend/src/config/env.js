import dotenv from "dotenv"
dotenv.config()

export const env = {
    port: process.env.PORT,
    url: process.env.URL,
    MONGO_URL: process.env.MONGO_URL,
    SECRET: process.env.SECRET,
    APP_PASS:process.env.APP_PASS,
    APP_GMAIL:process.env.APP_GMAIL,

}

