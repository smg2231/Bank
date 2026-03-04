import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div style={{ padding: 20 }}>
      <h1>Account {id}</h1>
      <p>This is the account dashboard.</p>

      <div style={{ marginTop: 20 }}>
        <Link href="/admin1">
          <button style={{ padding: "8px 16px" }}>
            Back to Admin
          </button>
        </Link>
      </div>
    </div>
  );
}