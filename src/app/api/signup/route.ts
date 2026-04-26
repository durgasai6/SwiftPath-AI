import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, companyName, email, password } = body;

    // Mock registration - in real app, save to database
    if (fullName && companyName && email && password) {
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          email,
          name: fullName,
          company: companyName
        }
      });
    }

    return NextResponse.json(
      { error: "Invalid data" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}