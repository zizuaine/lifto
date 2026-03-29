import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const donationSchema = new Schema({
    charityId: {
        type: ObjectId,
        ref: "Charity",
        required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    message: { type: String, default: "" },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Donation", donationSchema);
