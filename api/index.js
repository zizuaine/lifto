import "dotenv/config";
import app from "../Server/app.js";
import connectDB from "../Server/db.js";

export default async function handler(req, res) {
    await connectDB();
    return app(req, res);
}
