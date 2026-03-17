import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createSubmission } from "../controllers/submission.controller.js";

const submissionRoutes = Router();

submissionRoutes.post("/", authenticate, createSubmission);

export default submissionRoutes;