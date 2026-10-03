import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export async function getCurrentUser() {
    const cookieStore = await cookies()

    const token = cookieStore.get("token")?.value

    if (!token) throw new Error("No token found");

    const decode = verifyToken(token)

    if(!decode) throw new Error("Unauthorized");

    return decode.userId
}