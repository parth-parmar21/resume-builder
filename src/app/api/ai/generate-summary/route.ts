import { generateAiContent } from "@/lib/gemini";
import { GenerateSummary } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateSummary = await req.json()

        const { experienceLevel, skills, jobTitle } = body;

        if(!experienceLevel || !skills || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, {
                status: 400
            })
        }

        const prompt = `
        You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist.

        Write a professional resume summary for the candidate below.

        Candidate details:
        - Job title: ${jobTitle}
        - Experience level: ${experienceLevel}
        - Key skills: ${skills.join(", ")}

        Rules:
        1. Output ONLY the summary text. No headings, labels, titles, preamble, explanations, notes, or quotation marks around it.
        2. The summary must be between 50 and 100 words. Never go below 50 or above 100 words. Write it as a single paragraph.
        3. Write in implied first person: no "I", "my", or "he/she" (for example, "Results-driven Frontend Developer with..." rather than "I am a...").
        4. Open with the job title and experience level, then highlight the strongest skills and the value the candidate brings.
        5. Naturally include the job title and the provided skills as keywords, using exact wording from the skills list. Do not keyword-stuff or repeat the same term more than twice.
        6. Use strong, action-oriented language and avoid clichés such as "hard-working", "team player", "passionate", "detail-oriented", and "go-getter".
        7. Do not invent employers, degrees, certifications, years of experience, or metrics that were not provided. Match the tone to the experience level (for example, entry-level should emphasize learning ability and foundational skills, while senior should emphasize leadership and impact).
        8. Use plain text only: no bullet points, markdown, emojis, special characters, or formatting.
        9. Use standard, ATS-readable language and professional grammar.
`;

        const result = await generateAiContent(prompt)

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Summary generated successfully",
            data: { summary: result }
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error generating summary:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate summary",
        }, {
            status: 500
        })
    }
}