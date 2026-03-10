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

        const { page = 1, limit = 10, difficulty, search } = req.query;

        const skip = (page - 1) * limit;

        const filters = {};

        if (difficulty) {
            filters.difficulty = difficulty;
        }

        if (search) {
            filters.title = {
                contains: search,
                mode: "insensitive"
            };
        }

        const problems = await prisma.problem.findMany({
            where: filters,
            skip: Number(skip),
            take: Number(limit),
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
                createdAt: true
            }
        });

        const totalProblems = await prisma.problem.count({
            where: filters
        });

        res.status(200).json({
            success: true,
            page: Number(page),
            totalPages: Math.ceil(totalProblems / limit),
            totalProblems,
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

export const getProblemById = async (req, res) => {
    try {

        const { id } = req.params;

        const problem = await prisma.problem.findUnique({
            where: { id }
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        res.status(200).json({
            success: true,
            problem
        });

    } catch (error) {

        console.error("Get Problem Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch problem"
        });
    }
};

export const deleteProblem = async (req, res) => {
    try {

        const { id } = req.params;

        const problem = await prisma.problem.findUnique({
            where: { id }
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        await prisma.problem.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: "Problem deleted successfully"
        });

    } catch (error) {

        console.error("Delete Problem Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to delete problem"
        });
    }
};