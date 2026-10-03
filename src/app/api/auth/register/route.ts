import { connectDb } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { userModel } from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()

        const body: RegisterBody = await req.json()

        const { name, email, mobile, password } = body

        if (!name || !email || !password) {
            return NextResponse.json<ApiResponse>({
                message: "All fields are required",
                success: false,
            }, {
                status: 400
            })
        }

        const isExisiting = await userModel.findOne({ email })

        if (isExisiting) return NextResponse.json<ApiResponse>({
            message: "User already exists",
            success: false,
        }, {
            status: 409
        })

        const newUser = await userModel.create({
            name, email, password, mobile
        })

        const token = generateToken({ userId: newUser._id.toString() })

        let response = NextResponse.json<ApiResponse>({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            }
        }, { status: 201 })

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        })

        return response

    } catch (error) {
        console.log("Error in register api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong",
            error: {error}
        }, {status: 500})
    }
}