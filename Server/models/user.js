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
    },
    plan: {
        type: String,
        enum: ["standard", "premium", null],
        default: null
    },
    numbers: {
        type: [Number],
        default: []
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    subscriptionStatus: {
        type: String,
        enum: ["inactive", "active", "cancelled", "lapsed"],
        default: "inactive"
    },
    subscriptionAmount: {
        type: Number,
        default: 0
    },
    subscriptionStartedAt: {
        type: Date,
        default: null
    },
    subscriptionRenewalDate: {
        type: Date,
        default: null
    },
    numbersLocked: {
        type: Boolean,
        default: false
    },
    lastPlayedDraw: {
        type: mongoose.Types.ObjectId,
        ref: "Draw"
    },
    plan: {
        type: String,
        enum: ["standard", "premium"],
        default: "standard"
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
