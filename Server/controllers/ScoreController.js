import { getScore, addScore } from "../services/scoreService.js";

export async function getScoreController(req, res, next) {
    try {
        const userId = req.userId;
        const userScores = await getScore(userId)
        res.status(200).json(userScores);
    } catch (err) {
        next(err);
    }
}

export async function addScoreController(req, res, next) {
    try {
        const userId = req.userId;
        const { score } = req.body;

        if (!score || score < 1 || score > 45) {
            return res.status(400).json({
                message: "Score must be between 1 and 45"
            });;
        }
        const newScore = await addScore(userId, score);

        res.status(201).json(newScore);
    } catch (err) {
        next(err);
    }
}
