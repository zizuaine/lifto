import { Router } from "express";
import {
    createDonationController,
    getCharitiesController,
    getCharityByIdController,
    getFeaturedCharityController
} from "../controllers/charityController.js";

export const charityRouter = Router();

charityRouter.get("/", getCharitiesController);
charityRouter.get("/featured", getFeaturedCharityController);
charityRouter.get("/:id", getCharityByIdController);
charityRouter.post("/donations", createDonationController);
