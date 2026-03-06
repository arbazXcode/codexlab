import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

export const checkAdmin = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied. Admin only.",
            });
        }

        next();
    } catch (error) {
        console.error("Admin check error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};