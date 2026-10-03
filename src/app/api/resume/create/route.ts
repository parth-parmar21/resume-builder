import { connectDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { resumeModel } from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()

        const userId = await getCurrentUser()

        const newResume = await resumeModel.create({
            user_id: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [],
            certifications:[],
            skills: []
        })

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume created successfully",
            data: newResume
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error creating resume:", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to create resume",
        }, {
            status: 500
        })
    }
}