import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"
import { JWT_USER_PASSWORD } from "../config.js"

export const userAuthServices = {
    async signup({ email, password, firstname, lastname, charityId, charityPercentage }) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const err = new Error("User already exists")
            err.statusCode = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            password: hashedPassword,
            firstname,
            lastname,
            charityId,
            charityPercentage
        });
        return {
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            charityId: user.charityId,
            charityPercentage: user.charityPercentage
        }
    },

    async signin({ email, password }) {
        const user = await User.findOne({ email }).populate("charityId");

        if (!user) {
            const err = new Error("Please sign up first");
            err.statusCode = 401;
            throw err;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            const err = new Error("Invalid Credentials");
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign(
            {
                id: user._id.toString()
            },
            JWT_USER_PASSWORD,
            {
                expiresIn: "1h"
            })

        return {
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                charity: user.charityId,
                charityPercentage: user.charityPercentage
            }
        }
    }
}

