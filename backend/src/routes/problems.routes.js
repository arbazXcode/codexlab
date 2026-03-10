import { Router } from "express";
import { authenticate, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, getProblems, getProblemById } from "../controllers/problems.controller.js";

const problemRoutes = Router();

problemRoutes.post("/create", authenticate, checkAdmin, createProblem);
problemRoutes.get("/", getProblems);
problemRoutes.get("/:id", getProblemById);

export default problemRoutes;