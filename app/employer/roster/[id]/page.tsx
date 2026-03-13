import EmployeeDetail from "./EmployeeDetail";

export function generateStaticParams() {
  return [
    { id: "EMP-001" },
    { id: "EMP-002" },
    { id: "EMP-003" },
  ];
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmployeeDetail id={id} />;
}
