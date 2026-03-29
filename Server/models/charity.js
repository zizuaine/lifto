import mongoose from "mongoose";

const Schema = mongoose.Schema;

const charitySchema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    theme: { type: String, required: true },
    featured: { type: Boolean, default: false },
    upcomingEvents: [{ type: String }],
    independentDonationMinimum: { type: Number, default: 5 }
});

export default mongoose.model("Charity", charitySchema);
