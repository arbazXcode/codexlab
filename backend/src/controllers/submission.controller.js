import { prisma } from "../lib/db.js";
import { submitCodeToJudge0 } from "../services/judge0.service.js";

const languageMap = {
    cpp: 54,
    python: 71,
    javascript: 63,
    java: 62
};

export const createSubmission = async (req, res) => {
    try {

        const { sourceCode, language, problemId } = req.body;

        const languageId = languageMap[language];

        // 1️⃣ create submission
        const submission = await prisma.submission.create({
            data: {
                sourceCode,
                language,
                problemId,
                userId: req.user.id,
                status: "PENDING"
            }
        });

        // 2️⃣ send code to judge0
        const result = await submitCodeToJudge0(sourceCode, languageId);

        let status = "ACCEPTED";

        if (result.stderr) status = "RUNTIME_ERROR";
        if (result.compile_output) status = "COMPILATION_ERROR";

        // 3️⃣ update submission
        const updatedSubmission = await prisma.submission.update({
            where: { id: submission.id },
            data: {
                status,
                stdout: result.stdout,
                stderr: result.stderr
            }
        });

        res.status(201).json({
            success: true,
            submission: updatedSubmission
        });

    } catch (error) {

        console.error("Submission Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Submission execution failed"
        });

    }
};