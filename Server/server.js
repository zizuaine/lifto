import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./db.js";
import { userRouter } from "./routes/userAuthRoute.js";
import { adminRouter } from "./routes/adminAuthRoute.js";
import { scoreRouter } from "./routes/scoreRoute.js";
import { charityRouter } from "./routes/charityRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/scores", scoreRouter);
app.use("/api/charities", charityRouter);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Listening on port ${PORT}`)
    })
})
