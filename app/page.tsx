import { redirect } from "next/navigation";

// Direct redirect to admin dashboard (demo mode - no login required)
export default function HomePage() {
  redirect("/admin");
}