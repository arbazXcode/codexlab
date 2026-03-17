import { Router } from "express";
import { authenticate, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, getProblems, getProblemById, deleteProblem } from "../controllers/problems.controller.js";

const problemRoutes = Router();

problemRoutes.post("/create", authenticate, checkAdmin, createProblem);
problemRoutes.get("/", getProblems);
problemRoutes.get("/:id", getProblemById);
problemRoutes.delete("/:id", authenticate, checkAdmin, deleteProblem);

export default problemRoutes;