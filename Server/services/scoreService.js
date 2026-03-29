import Score from "../models/score.js";
import User from "../models/user.js";

async function syncUserNumbersFromScores(userId) {
    const latestScores = await Score.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5);
    const numbers = latestScores
        .map((entry) => entry.score)
        .sort((a, b) => a - b);

    await User.findByIdAndUpdate(userId, {
        numbers,
        numbersLocked: numbers.length === 5
    });

    return numbers;
}

const addScore = async (userId, score, date, course) => {
    const scores = await Score.find({ userId }).sort({ date: 1 });

    if (scores.length >= 5) {
        await Score.findByIdAndDelete(scores[0]._id)
    }

    const newScore = await Score.create({
        userId,
        score,
        course,
        ...(date ? { date } : {})
    })

    const numbers = await syncUserNumbersFromScores(userId);

    return {
        score: newScore,
        numbers
    };
}

const getScore = async (userId) => {
    const allScores = await Score.find({ userId }).sort({ date: -1 });
    return allScores
}

export { getScore, addScore, syncUserNumbersFromScores };
