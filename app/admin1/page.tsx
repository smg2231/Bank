"use client";

import { useState } from "react";
import Link from "next/link";
import TotalMoney from "@/components/sheena/TotalMoney";

export default function Admin1Page() {
  const [refreshKey, setRefreshKey] = useState(0);

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

      <article>
        <header>
          <h2>Deposit</h2>
        </header>
        <Link href="/accounts/1/deposit" role="button">
          Go to Deposit Page
        </Link>
      </article>
    </main>
  );
}