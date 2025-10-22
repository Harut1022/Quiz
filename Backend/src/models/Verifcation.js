import { Schema, model, Types } from "mongoose";

const verificationSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true, },
    code: { type: String, required: true },
    type: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
},
    { timestamps: true }


) // adds createdAt & updatedAt automatically



export default model("Verification", verificationSchema)