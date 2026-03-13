import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Dashboard | Clarity Health Network",
  description: "Manage your PPO network, claims, members, providers, and analytics.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
