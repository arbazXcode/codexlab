import { Router } from "express";
import { authenticate, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, getProblems } from "../controllers/problems.controller.js";

const problemRoutes = Router();

problemRoutes.post("/create", authenticate, checkAdmin, createProblem);
problemRoutes.get("/", getProblems);

export default problemRoutes;