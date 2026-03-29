import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userAuthRoute.js";
import { adminRouter } from "./routes/adminAuthRoute.js";
import { scoreRouter } from "./routes/scoreRoute.js";
import { charityRouter } from "./routes/charityRoute.js";
import { drawRouter } from "./routes/drawRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/scores", scoreRouter);
app.use("/api/charities", charityRouter);
app.use("/api/draw", drawRouter);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});

export default app;
