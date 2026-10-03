import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("monogodb connected");
    } catch (err) {
        console.log("Error while connecting db: ", err);
        process.exit(1)
    }
}