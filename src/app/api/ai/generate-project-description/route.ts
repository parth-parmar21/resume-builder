import { generateAiContent } from "@/lib/gemini";
import { GenerateProjectDescription } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateProjectDescription = await req.json()

        const { projectTitle, techStack } = body;

        if (!projectTitle || !techStack) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, {
                status: 400
            })
        }

        const prompt = `
You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist.

Write a professional project description for a resume using the details below.

Project details:
- Project title: ${projectTitle}
- Tech stack: ${techStack.join(", ")}

Rules:
1. Output ONLY the project description text. No headings, labels, project title, preamble, explanations, notes, or quotation marks around it.
2. The description must be between 40 and 80 words. Write it as a single paragraph of 2 to 3 sentences.
3. Start with a strong action verb (for example, "Developed", "Built", "Designed", "Implemented"). Do not use "I", "my", or "we".
4. Explain what the project does, the key features or technical work, and the value or outcome it delivers.
5. Naturally include the technologies from the tech stack as keywords, using their exact names. Only mention technologies that were provided.
6. Do not invent features, metrics, user counts, performance numbers, awards, or results that were not provided. If no overview is given, describe the project in general terms based on the title and tech stack.
7. Avoid vague filler such as "responsible for", "worked on", "various", "etc.", and clichés such as "passionate" or "cutting-edge".
8. Use plain text only: no bullet points, markdown, emojis, special characters, or formatting.
9. Use standard, ATS-readable language and professional grammar. Write in past tense for completed projects.
`;

        const result = await generateAiContent(prompt)

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "project description generated successfully",
            data: { projectDescription: result }
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error generating project description:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate project description",
        }, {
            status: 500
        })
    }
}