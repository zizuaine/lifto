import Draw from "../models/draw.js";
import Jackpot from "../models/jackpot.js";
import Score from "../models/score.js";
import User from "../models/user.js";
import Winner from "../models/winner.js";
import { syncUserNumbersFromScores } from "./scoreService.js";

const PLAN_CONFIG = {
    standard: {
        subscriptionAmount: 12,
        contribution: 12,
        renewalDays: 30
    },
    premium: {
        subscriptionAmount: 120,
        contribution: 120,
        renewalDays: 365
    }
};

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function normalizeNumbers(numbers) {
    if (!Array.isArray(numbers)) {
        throw createHttpError("Please select 5 numbers", 400);
    }

    const parsed = numbers.map((value) => Number(value));
    const uniqueNumbers = [...new Set(parsed)];
    const allValid = uniqueNumbers.every((value) => Number.isInteger(value) && value >= 1 && value <= 45);

    if (uniqueNumbers.length !== 5 || !allValid) {
        throw createHttpError("Numbers must be 5 unique values between 1 and 45", 400);
    }

    return uniqueNumbers.sort((a, b) => a - b);
}

function addDays(date, days) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
}

function getMonthKey(date = new Date()) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

function getNextMonthDate(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function generateRandomNumbers() {
    const set = new Set();

    while (set.size < 5) {
        set.add(Math.floor(Math.random() * 45) + 1);
    }

    return [...set].sort((a, b) => a - b);
}

function getMatchCount(userNumbers, drawNumbers) {
    return userNumbers.filter((number) => drawNumbers.includes(number)).length;
}

function calculatePrizeBreakdown(totalPool, jackpotAmount) {
    return {
        fiveMatchPool: Number((totalPool * 0.4 + jackpotAmount).toFixed(2)),
        fourMatchPool: Number((totalPool * 0.35).toFixed(2)),
        threeMatchPool: Number((totalPool * 0.25).toFixed(2))
    };
}

async function getActiveSubscribers() {
    return User.find({
        isSubscribed: true,
        subscriptionStatus: "active"
    });
}

async function getLatestPublishedDraw() {
    return Draw.findOne({ status: "published" }).sort({ drawDate: -1 });
}

async function getCurrentJackpot() {
    const currentMonthKey = getMonthKey();

    let jackpot = await Jackpot.findOne({
        monthKey: currentMonthKey,
        status: "active"
    });

    if (!jackpot) {
        jackpot = await Jackpot.create({
            amount: 0,
            monthKey: currentMonthKey
        });
    }

    return jackpot;
}

async function selectNumbers(userId, numbers) {
    const scores = await Score.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5);

    if (scores.length > 0) {
        throw createHttpError("Draw numbers are now generated from your latest 5 scores", 400);
    }

    const normalizedNumbers = normalizeNumbers(numbers);
    const user = await User.findByIdAndUpdate(
        userId,
        {
            numbers: normalizedNumbers,
            numbersLocked: true
        },
        { new: true }
    ).populate("charityId");

    if (!user) {
        throw createHttpError("User not found", 404);
    }

    return {
        message: "Numbers selected successfully",
        numbers: user.numbers
    };
}

async function subscribeUser(userId, plan) {
    const normalizedPlan = String(plan || "").toLowerCase();
    const planConfig = PLAN_CONFIG[normalizedPlan];

    if (!planConfig) {
        throw createHttpError("Invalid subscription plan", 400);
    }

    const now = new Date();
    const renewalDate = addDays(now, planConfig.renewalDays);

    const user = await User.findByIdAndUpdate(
        userId,
        {
            plan: normalizedPlan,
            isSubscribed: true,
            subscriptionStatus: "active",
            subscriptionAmount: planConfig.subscriptionAmount,
            subscriptionStartedAt: now,
            subscriptionRenewalDate: renewalDate
        },
        { new: true }
    ).populate("charityId");

    if (!user) {
        throw createHttpError("User not found", 404);
    }

    return {
        message: "Subscription activated successfully",
        subscription: {
            plan: user.plan,
            status: user.subscriptionStatus,
            amount: user.subscriptionAmount,
            renewalDate: user.subscriptionRenewalDate
        }
    };
}

async function getSubscription(userId) {
    const user = await User.findById(userId).populate("charityId");

    if (!user) {
        throw createHttpError("User not found", 404);
    }

    return {
        plan: user.plan,
        isSubscribed: user.isSubscribed,
        status: user.subscriptionStatus,
        amount: user.subscriptionAmount,
        startedAt: user.subscriptionStartedAt,
        renewalDate: user.subscriptionRenewalDate,
        charity: user.charityId,
        charityPercentage: user.charityPercentage
    };
}

async function getDrawResults(userId) {
    const winners = await Winner.find({ userId })
        .populate("drawId")
        .sort({ createdAt: -1 });

    return winners;
}

async function getUserDashboard(userId) {
    await syncUserNumbersFromScores(userId);
    const user = await User.findById(userId).populate("charityId");

    if (!user) {
        throw createHttpError("User not found", 404);
    }

    const [results, latestDraw, jackpot, scores] = await Promise.all([
        getDrawResults(userId),
        getLatestPublishedDraw(),
        getCurrentJackpot(),
        Score.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5)
    ]);

    const totalWon = results.reduce((sum, winner) => sum + winner.prize, 0);

    return {
        profile: {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        },
        subscription: {
            plan: user.plan,
            status: user.subscriptionStatus,
            amount: user.subscriptionAmount,
            renewalDate: user.subscriptionRenewalDate,
            isSubscribed: user.isSubscribed
        },
        charity: user.charityId,
        charityPercentage: user.charityPercentage,
        numbers: user.numbers,
        scores,
        latestDraw,
        jackpotAmount: jackpot.amount,
        winningsOverview: {
            totalWon: Number(totalWon.toFixed(2)),
            totalWins: results.length
        },
        results
    };
}

async function createWinnerDocs(draw, winnersByMatch, breakdown) {
    const winnerDocs = [];

    for (const matchCount of [3, 4, 5]) {
        const winners = winnersByMatch[matchCount];

        if (!winners.length) {
            continue;
        }

        const poolKey =
            matchCount === 5 ? "fiveMatchPool" :
                matchCount === 4 ? "fourMatchPool" :
                    "threeMatchPool";

        const prizeEach = Number((breakdown[poolKey] / winners.length).toFixed(2));

        for (const winner of winners) {
            winnerDocs.push({
                userId: winner.userId,
                matchCount,
                prize: prizeEach,
                drawId: draw._id,
                matchedNumbers: winner.matchedNumbers
            });
        }
    }

    if (winnerDocs.length) {
        await Winner.insertMany(winnerDocs);
    }

    return winnerDocs;
}

async function runDraw(adminId) {
    const activeSubscribers = await getActiveSubscribers();
    const eligibleUsers = activeSubscribers.filter((user) => Array.isArray(user.numbers) && user.numbers.length === 5);
    const jackpot = await getCurrentJackpot();

    const drawNumbers = generateRandomNumbers();

    const totalPool = activeSubscribers.reduce((sum, user) => {
        const planConfig = PLAN_CONFIG[user.plan] || PLAN_CONFIG.standard;
        return sum + planConfig.contribution;
    }, 0);

    const prizeBreakdown = calculatePrizeBreakdown(totalPool, jackpot.amount);
    const draw = await Draw.create({
        numbers: drawNumbers,
        totalPool,
        logicType: "random",
        status: "simulated",
        simulationNumbers: drawNumbers,
        simulationRunAt: new Date(),
        activeSubscribers: activeSubscribers.length,
        prizeBreakdown,
        jackpotCarriedIn: jackpot.amount
    });

    const winnersByMatch = { 3: [], 4: [], 5: [] };

    for (const user of eligibleUsers) {
        const matchedNumbers = user.numbers.filter((number) => drawNumbers.includes(number));
        const matchCount = getMatchCount(user.numbers, drawNumbers);

        if ([3, 4, 5].includes(matchCount)) {
            winnersByMatch[matchCount].push({
                userId: user._id,
                matchedNumbers
            });
        }
    }

    const winnerDocs = await createWinnerDocs(draw, winnersByMatch, prizeBreakdown);

    return {
        message: "Draw simulated successfully",
        draw,
        winners: winnerDocs
    };
}

async function publishResults(drawId, adminId) {
    const draw = await Draw.findById(drawId);

    if (!draw) {
        throw createHttpError("Draw not found", 404);
    }

    draw.status = "published";
    draw.publishedAt = new Date();
    draw.publishedBy = adminId;
    await draw.save();

    return {
        message: "Draw results published successfully",
        draw
    };
}

async function rolloverJackpot(drawId) {
    const draw = await Draw.findById(drawId);

    if (!draw) {
        throw createHttpError("Draw not found", 404);
    }

    const fiveMatchWinners = await Winner.countDocuments({
        drawId,
        matchCount: 5
    });

    if (fiveMatchWinners > 0) {
        draw.jackpotCarriedOut = 0;
        await draw.save();

        return {
            message: "Jackpot was claimed, so no rollover was created",
            amount: 0
        };
    }

    const rolloverAmount = draw.prizeBreakdown?.fiveMatchPool || 0;
    const nextMonthDate = getNextMonthDate(draw.drawDate || new Date());
    const nextMonthKey = getMonthKey(nextMonthDate);

    const jackpot = await Jackpot.findOneAndUpdate(
        { monthKey: nextMonthKey },
        {
            amount: rolloverAmount,
            monthKey: nextMonthKey,
            sourceDrawId: draw._id,
            status: "active"
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }
    );

    draw.jackpotCarriedOut = rolloverAmount;
    await draw.save();

    return {
        message: "Jackpot rolled over successfully",
        jackpot
    };
}

async function getAdminSummary() {
    const [draws, winners, jackpot, subscribers] = await Promise.all([
        Draw.find().sort({ createdAt: -1 }).limit(10).populate("publishedBy", "firstname lastname email"),
        Winner.find().sort({ createdAt: -1 }).limit(20).populate("userId", "firstname lastname email").populate("drawId"),
        getCurrentJackpot(),
        User.countDocuments({ isSubscribed: true, subscriptionStatus: "active" })
    ]);

    return {
        activeSubscribers: subscribers,
        currentJackpot: jackpot.amount,
        draws,
        winners
    };
}

async function submitWinnerProof(userId, winnerId, proofUrl) {
    const winner = await Winner.findOne({
        _id: winnerId,
        userId
    });

    if (!winner) {
        throw createHttpError("Winner record not found", 404);
    }

    winner.proofUrl = proofUrl;
    winner.verificationStatus = "pending";
    winner.verificationReviewedBy = null;
    winner.verificationReviewedAt = null;
    winner.verificationNotes = "";
    await winner.save();

    return {
        message: "Winner proof submitted successfully",
        winner
    };
}

async function reviewWinner(adminId, winnerId, verificationStatus, verificationNotes = "") {
    const winner = await Winner.findById(winnerId);

    if (!winner) {
        throw createHttpError("Winner record not found", 404);
    }

    winner.verificationStatus = verificationStatus;
    winner.verificationReviewedBy = adminId;
    winner.verificationReviewedAt = new Date();
    winner.verificationNotes = verificationNotes;
    await winner.save();

    return {
        message: `Winner ${verificationStatus} successfully`,
        winner
    };
}

async function markWinnerPaid(adminId, winnerId) {
    const winner = await Winner.findById(winnerId);

    if (!winner) {
        throw createHttpError("Winner record not found", 404);
    }

    if (winner.verificationStatus !== "approved") {
        throw createHttpError("Winner must be approved before marking payout as paid", 400);
    }

    winner.payoutStatus = "paid";
    winner.paidAt = new Date();
    winner.verificationReviewedBy = adminId;
    await winner.save();

    return {
        message: "Winner payout marked as paid",
        winner
    };
}

export {
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
};
