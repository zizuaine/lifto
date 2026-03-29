import mongoose from "mongoose";

const drawSchema = new mongoose.Schema({
    numbers: {
        type: [Number],
        required: true,
        validate: {
            validator: (value) => Array.isArray(value) && value.length === 5,
            message: "A draw must contain exactly 5 numbers"
        }
    },
    totalPool: {
        type: Number,
        required: true,
        min: 0
    },
    logicType: {
        type: String,
        enum: ["random"],
        default: "random"
    },
    status: {
        type: String,
        enum: ["draft", "simulated", "published"],
        default: "draft"
    },
    simulationNumbers: {
        type: [Number],
        default: []
    },
    simulationRunAt: {
        type: Date,
        default: null
    },
    publishedAt: {
        type: Date,
        default: null
    },
    publishedBy: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
        default: null
    },
    activeSubscribers: {
        type: Number,
        default: 0,
        min: 0
    },
    prizeBreakdown: {
        fiveMatchPool: {
            type: Number,
            default: 0,
            min: 0
        },
        fourMatchPool: {
            type: Number,
            default: 0,
            min: 0
        },
        threeMatchPool: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    jackpotCarriedIn: {
        type: Number,
        default: 0,
        min: 0
    },
    jackpotCarriedOut: {
        type: Number,
        default: 0,
        min: 0
    },
    drawDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model("Draw", drawSchema);
