import { Router } from "express";
import {
    getAdminSummaryController,
    getDashboardController,
    getDrawResultsController,
    getSubscriptionController,
    markWinnerPaidController,
    publishResultsController,
    reviewWinnerController,
    rolloverJackpotController,
    runDrawController,
    selectNumbersController,
    submitWinnerProofController,
    subscribeController
} from "../controllers/drawController.js";
import { adminMiddleware } from "../middleware/admin.js";
import { userMiddleware } from "../middleware/user.js";

export const drawRouter = Router();

drawRouter.post("/numbers", userMiddleware, selectNumbersController);
drawRouter.post("/subscribe", userMiddleware, subscribeController);
drawRouter.get("/subscription", userMiddleware, getSubscriptionController);
drawRouter.get("/results", userMiddleware, getDrawResultsController);
drawRouter.get("/dashboard", userMiddleware, getDashboardController);
drawRouter.post("/results/proof", userMiddleware, submitWinnerProofController);

drawRouter.get("/admin/summary", adminMiddleware, getAdminSummaryController);
drawRouter.post("/admin/run", adminMiddleware, runDrawController);
drawRouter.post("/admin/:drawId/publish", adminMiddleware, publishResultsController);
drawRouter.post("/admin/:drawId/rollover", adminMiddleware, rolloverJackpotController);
drawRouter.post("/admin/winners/review", adminMiddleware, reviewWinnerController);
drawRouter.post("/admin/winners/:winnerId/pay", adminMiddleware, markWinnerPaidController);
