import { Router } from "express";
import { addScoreController, getScoreController } from "../controllers/ScoreController.js";
import { userMiddleware } from "../middleware/user.js";

export const scoreRouter = Router();

scoreRouter.post("/", userMiddleware, addScoreController);
scoreRouter.get("/", userMiddleware, getScoreController);
