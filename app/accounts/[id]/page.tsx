"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const success = searchParams.get("success");
  const amount = searchParams.get("amount");
  const type = searchParams.get("type");

  useEffect(() => {
    if (!id) return;

    const accountId = Array.isArray(id) ? id[0] : id;

    // Access control: check logged-in account
    const loggedInAccountId = localStorage.getItem("loggedInAccountId");
    const role = localStorage.getItem("loggedInRole");

    if (!loggedInAccountId) {
      alert("Please log in first");
      router.push("/login"); // redirect to login page
      return;
    }

    // Prevent users from accessing other accounts
    if (role !== "admin" && loggedInAccountId !== accountId) {
      alert("Access denied!");
      router.push("/"); // redirect to homepage or login
      return;
    }

    const fetchAccount = async () => {
      try {
        const res = await fetch(
          `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}`
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setAccount(data);
      } catch {
        console.log("Fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id, router]);

  if (loading) return <p>Loading...</p>;
  if (!account) return <p>Account not found</p>;

  return (
    <div style={{ padding: 20 }}>
      {localStorage.getItem("loggedInRole") === "admin" && (
        <Link
          href="/admin1"
          style={{
            display: "inline-block",
            marginBottom: 15,
            padding: "8px 12px",
            background: "#eee",
            textDecoration: "none",
          }}
        >
          ← Back to Admin
        </Link>
      )}

      <h2>Account Page</h2>

      {success && (
        <div style={{ color: "green" }}>
          <p>
            {type === "deposit"
              ? "Deposit successful"
              : "Withdrawal successful"}
          </p>
          {amount && <p>Amount: ${amount}</p>}
        </div>
      )}

      <h2>Account Information</h2>
      <p>
        <strong>ID:</strong> {account.id}
      </p>
      <p>
        <strong>Balance:</strong> ${account.balance}
      </p>

      <h3 style={{ marginTop: 20 }}>Transaction History</h3>

      {account.transactions && account.transactions.length > 0 ? (
        <ul>
          {account.transactions
            .slice()
            .reverse()
            .map((tx: any, index: number) => (
              <li key={index}>
                <strong>{tx.type.toUpperCase()}</strong> - ${tx.amount} <br />
                <small>{new Date(tx.date).toLocaleString()}</small>
              </li>
            ))}
        </ul>
      ) : (
        <p>No transactions yet.</p>
      )}
    </div>
  );
}