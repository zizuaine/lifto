import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const scoreSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        min: 1,
        max: 45,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Score", scoreSchema);
