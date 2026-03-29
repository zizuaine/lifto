import Admin from "../models/admin.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_ADMIN_PASSWORD } from "../config.js";

const DEFAULT_ADMIN = {
    email: "nu50855@gmail.com",
    password: "herbluesky10",
    firstname: "Lifto",
    lastname: "Admin"
};

async function ensureDefaultAdmin() {
    let admin = await Admin.findOne({ email: DEFAULT_ADMIN.email });

    if (!admin) {
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
        admin = await Admin.create({
            email: DEFAULT_ADMIN.email,
            password: hashedPassword,
            firstname: DEFAULT_ADMIN.firstname,
            lastname: DEFAULT_ADMIN.lastname
        });
    }

    return admin;
}

export const adminAuthService = {
    async signup({ email, password, firstname, lastname }) {

        const existingAdmin = await Admin.findOne({ email })

        if (existingAdmin) {
            const err = new Error("Admin already exists")
            err.statusCode = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            email,
            password: hashedPassword,
            firstname,
            lastname
        });

        return {
            id: admin._id.toString(),
            email: admin.email,
            firstname: admin.firstname,
            lastname: admin.lastname
        };
    },

    async signin({ email, password }) {
        await ensureDefaultAdmin();

        const admin = await Admin.findOne({
            email
        });

        if (!admin) {
            const err = new Error("Invalid Credentials ");
            err.statusCode = 401;
            throw err;
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign(
            { adminId: admin._id.toString() },
            JWT_ADMIN_PASSWORD,
            { expiresIn: "1h" }
        );

        return {
            token,
            admin: {
                id: admin._id.toString(),
                email: admin.email,
                firstname: admin.firstname,
                lastname: admin.lastname
            }
        };


    }
};
