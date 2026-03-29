import { z } from "zod";
import {
    getAdminSummary,
    getDrawResults,
    getSubscription,
    getUserDashboard,
    markWinnerPaid,
    publishResults,
    reviewWinner,
    rolloverJackpot,
    runDraw,
    selectNumbers,
    submitWinnerProof,
    subscribeUser
} from "../services/drawService.js";

const selectNumbersSchema = z.object({
    numbers: z.array(z.number().int().min(1).max(45)).length(5)
});

const subscribeSchema = z.object({
    plan: z.enum(["standard", "premium"])
});

const drawIdParamsSchema = z.object({
    drawId: z.string().min(1)
});

const winnerProofSchema = z.object({
    winnerId: z.string().min(1),
    proofUrl: z.string().url()
});

const reviewWinnerSchema = z.object({
    winnerId: z.string().min(1),
    verificationStatus: z.enum(["approved", "rejected"]),
    verificationNotes: z.string().max(500).optional().default("")
});

const winnerIdParamsSchema = z.object({
    winnerId: z.string().min(1)
});

export async function selectNumbersController(req, res, next) {
    try {
        const parsed = selectNumbersSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Please provide 5 valid numbers",
                error: parsed.error.errors
            });
        }

        const result = await selectNumbers(req.userId, parsed.data.numbers);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function subscribeController(req, res, next) {
    try {
        const parsed = subscribeSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Please choose a valid subscription plan",
                error: parsed.error.errors
            });
        }

        const result = await subscribeUser(req.userId, parsed.data.plan);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getSubscriptionController(req, res, next) {
    try {
        const result = await getSubscription(req.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getDrawResultsController(req, res, next) {
    try {
        const result = await getDrawResults(req.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getDashboardController(req, res, next) {
    try {
        const result = await getUserDashboard(req.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function submitWinnerProofController(req, res, next) {
    try {
        const parsed = winnerProofSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Please provide a valid proof link",
                error: parsed.error.errors
            });
        }

        const result = await submitWinnerProof(req.userId, parsed.data.winnerId, parsed.data.proofUrl);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function runDrawController(req, res, next) {
    try {
        const result = await runDraw(req.userId);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function publishResultsController(req, res, next) {
    try {
        const parsed = drawIdParamsSchema.safeParse(req.params);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid draw id",
                error: parsed.error.errors
            });
        }

        const result = await publishResults(parsed.data.drawId, req.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function rolloverJackpotController(req, res, next) {
    try {
        const parsed = drawIdParamsSchema.safeParse(req.params);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid draw id",
                error: parsed.error.errors
            });
        }

        const result = await rolloverJackpot(parsed.data.drawId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getAdminSummaryController(req, res, next) {
    try {
        const result = await getAdminSummary();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function reviewWinnerController(req, res, next) {
    try {
        const parsed = reviewWinnerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid winner review details",
                error: parsed.error.errors
            });
        }

        const result = await reviewWinner(
            req.userId,
            parsed.data.winnerId,
            parsed.data.verificationStatus,
            parsed.data.verificationNotes
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export async function markWinnerPaidController(req, res, next) {
    try {
        const parsed = winnerIdParamsSchema.safeParse(req.params);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid winner id",
                error: parsed.error.errors
            });
        }

        const result = await markWinnerPaid(req.userId, parsed.data.winnerId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
