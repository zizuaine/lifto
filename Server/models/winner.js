import mongoose from "mongoose";

const Schema = mongoose.Schema;

const winnerSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    matchCount: {
        type: Number,
        enum: [3, 4, 5],
        required: true
    },
    prize: {
        type: Number,
        required: true,
        min: 0
    },
    drawId: {
        type: mongoose.Types.ObjectId,
        ref: "Draw",
        required: true
    },
    matchedNumbers: {
        type: [Number],
        default: []
    },
    proofUrl: {
        type: String,
        default: ""
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    verificationReviewedBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        default: null
    },
    verificationReviewedAt: {
        type: Date,
        default: null
    },
    verificationNotes: {
        type: String,
        default: ""
    },
    payoutStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },
    paidAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model("Winner", winnerSchema);
