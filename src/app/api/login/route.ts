import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock authentication - in real app, verify against database
    if (email && password) {
      // For demo, accept any email/password
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          email,
          name: "Demo User"
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}