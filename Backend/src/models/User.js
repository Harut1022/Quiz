import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    username: { type: String, required: true, unique: [true, "Username is busy"] },
    email: { type: String, unique: [true, "Email is busy"], sparse: true },
    phone: { type: String, unique: [true, "Phone number is busy"], sparse: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: {type: Boolean, default: false},
    attempts: {type: Number, default: 0},
    avatar:{type:String},
    role: { type: String, default: "member" },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password is short"]
    },

})


export default model("User", userSchema)