import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String },
    surname: { type: String },
    username: { type: String, required: true, unique: [true, "Username is busy"] },
    email: { type: String, unique: [true, "Email is busy"], sparse: true },
    phone: { type: String, unique: [true, "Phone number is busy"], sparse: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "member" },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password is short"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])[A-Za-z\d!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]{8,20}$/,
            "Password does not meet the requirements"
        ]
    },

})


export default model("User", userSchema)