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
        const { score, date, course } = req.body;

        if (!score || score < 1 || score > 45) {
            return res.status(400).json({
                message: "Score must be between 1 and 45"
            });;
        }

        if (!course || !String(course).trim()) {
            return res.status(400).json({
                message: "Golf club / course is required"
            });
        }

        const newScore = await addScore(userId, score, date, course);

        res.status(201).json(newScore);
    } catch (err) {
        next(err);
    }
}
