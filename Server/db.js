import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected")
    } catch (err) {
        console.log(err)
        console.log("Failed to connect");
    }
}

export default connectDB;