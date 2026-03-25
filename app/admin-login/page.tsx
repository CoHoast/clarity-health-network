import { redirect } from "next/navigation";

// Demo mode - no login required, go straight to admin
export default function AdminLoginPage() {
  redirect("/admin");
}
