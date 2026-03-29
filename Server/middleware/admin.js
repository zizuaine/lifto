import jwt from "jsonwebtoken"
import { JWT_ADMIN_PASSWORD } from "../config.js"

export function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Token missing"
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.userId = decoded.adminId;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid or Expired token"
        });
    }
}

