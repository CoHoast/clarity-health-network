import { redirect } from "next/navigation";

// Redirect login to admin-login for now
// Future: implement separate member/provider/employer portals
export default function LoginPage() {
  redirect("/admin-login");
}
