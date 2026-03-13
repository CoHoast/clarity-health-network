import ProviderLayout from "@/components/provider/ProviderLayout";

export const metadata = {
  title: "Provider Portal | Clarity Health Network",
  description: "Submit claims, verify eligibility, view payments, and manage your practice.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProviderLayout>{children}</ProviderLayout>;
}
