import { z } from "zod";
import {
    createDonation,
    getAllCharities,
    getCharityById,
    getFeaturedCharity
} from "../services/charityService.js";

const donationSchema = z.object({
    charityId: z.string().min(1),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    amount: z.number().min(1),
    message: z.string().max(300).optional().default("")
});

export async function getCharitiesController(req, res, next) {
    try {
        const { search = "", category = "" } = req.query;
        const charities = await getAllCharities(search, category);
        res.status(200).json(charities);
    } catch (err) {
        next(err);
    }
}

export async function getFeaturedCharityController(req, res, next) {
    try {
        const charity = await getFeaturedCharity();
        res.status(200).json(charity);
    } catch (err) {
        next(err);
    }
}

export async function getCharityByIdController(req, res, next) {
    try {
        const charity = await getCharityById(req.params.id);
        res.status(200).json(charity);
    } catch (err) {
        next(err);
    }
}

export async function createDonationController(req, res, next) {
    try {
        const parsed = donationSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid donation details",
                error: parsed.error.errors
            });
        }

        const donation = await createDonation(parsed.data);
        res.status(201).json({
            message: "Donation submitted successfully",
            donation
        });
    } catch (err) {
        next(err);
    }
}
