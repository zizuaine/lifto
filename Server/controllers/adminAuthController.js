import { adminAuthService } from "../services/adminAuthService.js";
import { z } from "zod"

const adminSignUpSchema = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(5).max(20),
    firstname: z.string().min(3).max(100),
    lastname: z.string().min(3).max(100),
});

export async function adminSignUpController(req, res, next) {
    try {
        const parsed = adminSignUpSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Incorrect credentials",
                error: parsed.error.errors
            })
        }

        const admin = await adminAuthService.signup(parsed.data);
        res.status(201).json(admin);
    } catch (err) {
        next(err);
    }
}

export async function adminSignInController(req, res, next) {
    try {
        const admin = await adminAuthService.signin(req.body);
        res.status(200).json(admin);
    } catch (err) {
        next(err);
    }
}

