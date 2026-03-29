import { userAuthServices } from "../services/userAuthService.js";
import { z } from "zod"

const UserSignUpSchema = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(5).max(20),
    firstname: z.string().min(3).max(100),
    lastname: z.string().min(3).max(100),
    charityId: z.string().min(1),
    charityPercentage: z.number().min(10).max(100).optional().default(10)
})

export async function userSignUpController(req, res, next) {
    try {
        const parsed = UserSignUpSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Incorrect credentials",
                error: parsed.error.errors
            })
        }

        const user = await userAuthServices.signup(parsed.data);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}

export async function userSignInController(req, res, next) {
    try {
        const user = await userAuthServices.signin(req.body);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

