import ProviderDetail from "./ProviderDetail";

export function generateStaticParams() {
  return [
    { id: "PRV-001" },
    { id: "PRV-002" },
    { id: "PRV-003" },
  ];
}

export default async function AdminProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProviderDetail id={id} />;
}
