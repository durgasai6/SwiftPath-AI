import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionCookieName, updateUserProfile, verifySessionToken } from "@/lib/server/auth-store";

const profileSchema = z.object({
  fullName: z.string().trim().min(2),
  companyName: z.string().trim().min(2),
  email: z.string().email()
});

export async function GET() {
  const cookieStore = await cookies();
  const user = await verifySessionToken(cookieStore.get(getSessionCookieName())?.value);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const user = await verifySessionToken(cookieStore.get(getSessionCookieName())?.value);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter valid profile details." }, { status: 400 });
  }

  const result = await updateUserProfile(user.id, parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({ user: result.user });
}
