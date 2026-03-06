import { z } from "zod";

export const createProblemSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.array(z.string()),
    examples: z.any(),
    constraints: z.string(),
    hints: z.string().optional(),
    editorial: z.string().optional(),
    testCases: z.any(),
    codeSnippets: z.any(),
    referenceSolutions: z.any()
});