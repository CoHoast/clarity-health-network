import MemberLayout from "@/components/member/MemberLayout";

export const metadata = {
  title: "Member Portal | Clarity Health Network",
  description: "Access your benefits, find providers, view claims, and manage your healthcare.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MemberLayout>{children}</MemberLayout>;
}
