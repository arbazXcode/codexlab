import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({
            error: "Invalid token"
        });
    }
};