import { NextResponse } from "next/server";
import { getCurrentUser, type JWTPayload } from "./auth";

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAuth(): Promise<
  { user: JWTPayload } | { error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: errorResponse("Unauthorized", 401) };
  }
  return { user };
}
