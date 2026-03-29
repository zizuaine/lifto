import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstname: String,
    lastname: String,
    charityId: {
        type: mongoose.Types.ObjectId,
        ref: "Charity"
    },
    charityPercentage: {
        type: Number,
        default: 10
    }
});

export default mongoose.model("User", userSchema);
