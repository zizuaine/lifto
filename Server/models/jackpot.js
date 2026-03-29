import mongoose from "mongoose";

const jackpotSchema = new mongoose.Schema({
    amount: {
        type: Number,
        default: 0,
        min: 0
    },
    monthKey: {
        type: String,
        required: true,
        unique: true
    },
    drawId: {
        type: mongoose.Types.ObjectId,
        ref: "Draw",
        default: null
    },
    sourceDrawId: {
        type: mongoose.Types.ObjectId,
        ref: "Draw",
        default: null
    },
    status: {
        type: String,
        enum: ["active", "rolled_over", "awarded"],
        default: "active"
    }
}, { timestamps: true });

export default mongoose.model("Jackpot", jackpotSchema);
