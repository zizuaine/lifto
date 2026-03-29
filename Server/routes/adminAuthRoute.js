import { Router } from "express";
import {
    adminSignInController,
    adminSignUpController
} from "../controllers/adminAuthController.js"

export const adminRouter = Router();

adminRouter.post("/signup", adminSignUpController);
adminRouter.post("/signin", adminSignInController);
