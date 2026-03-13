import { clearAuthCookie } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-helpers";

export async function POST() {
  await clearAuthCookie();
  return jsonResponse({ message: "Logged out" });
}
