import { generateAiContent } from "@/lib/gemini";
import { GenerateSkills } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body: GenerateSkills = await req.json()

        const { experienceLevel, jobTitle } = body;

        if (!experienceLevel || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Missing required fields",
            }, {
                status: 400
            })
        }

        const prompt = `
You are an expert technical recruiter and ATS (Applicant Tracking System) optimization specialist.

Generate a list of relevant technical skills for the candidate below.

Candidate details:
- Job title: ${jobTitle}
- Experience level: ${experienceLevel}

Rules:
1. Respond with a raw JSON array of strings and nothing else. The first character of your response must be [ and the last must be ]. Do not add markdown, code fences, line breaks for formatting, keys, or any text before or after the array.
2. Include only technical skills: programming languages, frameworks, libraries, databases, tools, platforms, cloud services, and technical methodologies (for example, "REST APIs", "CI/CD", "Unit Testing").
3. Do NOT include soft skills (such as communication, leadership, teamwork, problem-solving).
4. Return between 8 and 12 skills, ordered from most to least relevant for the job title.
5. Match the skills to the experience level. Entry-level should focus on foundational, widely used skills, mid-level should add broader tooling and practices, and senior should include architecture, system design, and advanced tools.
6. Use the standard industry name with correct capitalization (for example, "JavaScript", "PostgreSQL", "Node.js").
7. Do not repeat skills or list the same technology under different names.
8. Only include real, currently used technologies.
`;

        const result = await generateAiContent(prompt)

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Skills generated successfully",
            data: { skills: JSON.parse(result!) }
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error generating skills:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to generate skills",
        }, {
            status: 500
        })
    }
}