import ClaimDetail from "./ClaimDetail";

export function generateStaticParams() {
  return [
    { id: "CLM-2024-0156" },
    { id: "CLM-2024-0157" },
    { id: "CLM-2024-0158" },
  ];
}

export default async function AdminClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClaimDetail id={id} />;
}
