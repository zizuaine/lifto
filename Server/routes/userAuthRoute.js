import { Router } from "express";
import {
    userSignUpController, userSignInController
}
    from "../controllers/userAuthController.js"

export const userRouter = Router();

userRouter.post("/signup", userSignUpController);
userRouter.post("/signin", userSignInController);

