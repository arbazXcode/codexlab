import axios from "axios";

export const submitCodeToJudge0 = async (sourceCode, languageId, stdin = "") => {
    const response = await axios.post(
        `${process.env.JUDGE0_API_URL}/submissions`,
        {
            source_code: sourceCode,
            language_id: languageId,
            stdin
        },
        {
            params: {
                base64_encoded: false,
                wait: true
            },
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
            }
        }
    );

    return response.data;
};