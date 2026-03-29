import Score from "../models/score.js";

const addScore = async (userId, score) => {
    const scores = await Score.find({ userId }).sort({ date: 1 });

    if (scores.length >= 5) {
        await Score.findByIdAndDelete(scores[0]._id)
    }

    const newScore = await Score.create({
        userId,
        score
    })

    return newScore;
}

const getScore = async (userId) => {
    const allScores = await Score.find({ userId }).sort({ date: -1 });
    return allScores
}

export { getScore, addScore };
