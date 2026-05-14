import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo-mode";

// In demo mode, redirect directly to admin dashboard (no auth required)
// In production mode, redirect to admin-login for authentication
export default function LoginPage() {
  if (DEMO_MODE) {
    redirect("/admin");
  } else {
    redirect("/admin-login");
  }
}
