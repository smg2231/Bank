"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TotalMoney from "@/components/TotalMoney";
import LoginPage from "@/components/LoginPage";

export default function Admin1Page() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [loggedInAccountId, setLoggedInAccountId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accountId = localStorage.getItem("loggedInAccountId");
    const userRole = localStorage.getItem("loggedInRole");

    setLoggedInAccountId(accountId);
    setRole(userRole);

    // Only admin1 can access this page
    if (userRole !== "admin" || accountId !== "admin1") {
      alert("Access denied!");
      router.push("/login");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="container">
      <hgroup>
        <h1>Admin Page</h1>
        <p>Welcome to the Admin landing page.</p>
      </hgroup>

      <article>
        <header>
          <h2>Total Money</h2>
        </header>
        <TotalMoney key={refreshKey} />
      </article>

      {/* Dynamic links using logged-in account ID */}
      <article>
        <header>
          <h2>Deposit</h2>
        </header>
        <Link
          href={`/accounts/${loggedInAccountId}/deposit`}
          role="button"
        >
          Go to Deposit Page
        </Link>
      </article>

      <article>
        <header>
          <h2>Withdraw</h2>
        </header>
        <Link
          href={`/accounts/${loggedInAccountId}/withdraw`}
          role="button"
        >
          Go to Withdraw Page
        </Link>
      </article>

      <article>
        <header>
          <h2>History</h2>
        </header>
        <Link
          href={`/accounts/${loggedInAccountId}/history`}
          role="button"
        >
          Go to History Page
        </Link>
      </article>

      <article>
        <header>
          <h2>Transfer</h2>
        </header>
        <Link
          href={`/accounts/${loggedInAccountId}/transfer`}
          role="button"
        >
          Go to Transfer Page
        </Link>
      </article>

      <article>
        <header>
          <h2>Login</h2>
        </header>
        <LoginPage />
      </article>
    </main>
  );
}