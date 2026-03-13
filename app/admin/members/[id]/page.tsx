import MemberDetail from "./MemberDetail";

export function generateStaticParams() {
  return [
    { id: "MEM-12847" },
    { id: "MEM-12848" },
    { id: "MEM-12849" },
  ];
}

export default async function AdminMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MemberDetail id={id} />;
}
