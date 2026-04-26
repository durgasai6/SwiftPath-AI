import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  createUser,
  getSessionCookieName,
  getSessionMaxAgeSeconds
} from "@/lib/server/auth-store";

const signupSchema = z.object({
  fullName: z.string().trim().min(2),
  companyName: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please complete all fields with valid values." }, { status: 400 });
    }

    const result = await createUser(parsed.data);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    const response = NextResponse.json({ success: true, user: result.user }, { status: 201 });
    response.cookies.set(getSessionCookieName(), createSessionToken(result.user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionMaxAgeSeconds()
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
