import { generateAiContent } from "@/lib/gemini";
import { GenerateExperienceDescription } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateExperienceDescription = await req.json()

        const { experienceLevel, yearsOfExperience, techStack, jobRole } = body;

        if (!experienceLevel|| !yearsOfExperience || !techStack || !jobRole) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, {
                status: 400
            })
        }

        const prompt = `
You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist.

Write professional work experience bullet points for a resume using the details below.

Candidate details:
- Job role: ${jobRole}
- Experience level: ${experienceLevel}
- Years of experience: ${yearsOfExperience}
- Tech stack: ${techStack.join(", ")}

Rules:
1. Output ONLY the bullet points. No headings, labels, company names, job title, preamble, explanations, notes, or quotation marks.
2. Write exactly 4 bullet points. Put each bullet on its own line, starting with "- ". Each bullet must be 15 to 25 words.
3. Start every bullet with a different strong action verb (for example, "Developed", "Built", "Optimized", "Led", "Designed"). Do not use "I", "my", or "we".
4. Each bullet should describe what was done, the technology used, and the impact or purpose.
5. Naturally include the technologies from the tech stack as keywords, using their exact names. Spread them across the bullets and only mention technologies that were provided.
6. Match the scope and tone to the experience level and years of experience. Entry-level should emphasize contributing to features, learning, and collaboration. Mid-level should emphasize ownership of features and code quality. Senior should emphasize leadership, architecture, mentoring, and technical decisions.
7. Do not invent company names, clients, metrics, percentages, user counts, revenue figures, or awards. Describe impact in qualitative terms (for example, "improving performance and maintainability") unless numbers were provided.
8. Avoid vague filler such as "responsible for", "worked on", "various", "etc.", and clichés such as "team player" or "hard-working".
9. Use plain text only: no markdown, emojis, bold text, or special characters other than the leading "- ". Write in past tense, and use standard ATS-readable language with professional grammar.
`;

        const result = await generateAiContent(prompt)

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "experience description generated successfully",
            data: { experienceDescription: result }
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error generating experience description:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate experience description",
        }, {
            status: 500
        })
    }
}