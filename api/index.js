import "dotenv/config";
import app from "../Server/app.js";
import connectDB from "../Server/db.js";

await connectDB();

export default app;
