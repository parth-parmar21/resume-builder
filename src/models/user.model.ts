import { IUser } from "@/types/user.types";
import mongoose, { Document } from "mongoose";
import bcrypt from 'bcrypt'

//Omit is use to use value from another interface and remove values based on requirement. in this case _id will be remove
interface UserDocument extends Omit<IUser, "_id">, Document {
    comparePass(candidatePassword: string): boolean
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "minimun 6 chars required"]
    },
    mobile: {
        type: String,
        minLength: [10, "min 10 numbers required"],
        maxLength: [10, "max 10 numbers required"],
    }
}, { timestamps: true })


userSchema.pre("save", function (): void {
    if (!this.isModified("password")) return
    this.password = bcrypt.hashSync(this.password, 10)
})

userSchema.methods.comparePass = function (candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password)
}

export const userModel = mongoose.model("User", userSchema)