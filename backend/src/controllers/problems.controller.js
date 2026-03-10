import { prisma } from "../lib/db.js";
import { createProblemSchema } from "../validation/problem.validation.js";

export const createProblem = async (req, res) => {
    try {

        const parsedData = createProblemSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                success: false,
                errors: parsedData.error.issues.map(err => err.message)
            });
        }

        const {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            hints,
            editorial,
            testCases,
            codeSnippets,
            referenceSolutions
        } = parsedData.data;

        const problem = await prisma.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                hints,
                editorial,
                testCases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id
            }
        });

        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem
        });

    } catch (error) {

        console.error("Create Problem Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getProblems = async (req, res) => {
    try {

        const problems = await prisma.problem.findMany({
            select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({
            success: true,
            count: problems.length,
            problems
        });

    } catch (error) {
        console.error("Get Problems Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch problems"
        });
    }
};