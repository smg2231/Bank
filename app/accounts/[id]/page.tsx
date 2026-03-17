import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const res = await fetch(
    `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-6">Account not found</div>;
  }

  const account = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Account {params.id}</h1>
      <p className="text-gray-600">Account dashboard</p>

      <div className="mt-6 text-lg">
        Balance:{" "}
        <span className="font-semibold">
          ${Number(account.balance ?? account.totalMoney ?? 0)}
        </span>
      </div>

      <div className="mt-6">
        <Link
          href="/admin1"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Admin
        </Link>
      </div>
    </div>
  );
}