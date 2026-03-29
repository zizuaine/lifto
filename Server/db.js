import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        if (!connectionPromise) {
            connectionPromise = mongoose.connect(process.env.MONGO_URL);
        }

        await connectionPromise;
        console.log("MongoDB connected")
        return mongoose.connection;
    } catch (err) {
        console.log(err)
        console.log("Failed to connect");
        connectionPromise = null;
        throw err;
    }
}

export default connectDB;
