import { Router } from "express";
import { authenticate, checkAdmin } from "../middleware/auth.middleware.js"
import { createProblem } from "../controllers/problems.controllers.js";

const problemRoutes = Router();

problemRoutes.post("/problem", authenticate, checkAdmin, createProblem)

export default problemRoutes;