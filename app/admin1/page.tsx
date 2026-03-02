"use client";

import { useState } from "react";
import Link from "next/link";
import TotalMoney from "@/components/sheena/TotalMoney";

export default function Admin1Page() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main style={{ padding: 20 }}>
      <h1>Admin Page</h1>
      <p>Welcome to the Admin landing page.</p>

      <div style={{ marginTop: 20 }}>
        <h2>Total Money</h2>
        <TotalMoney key={refreshKey} />
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Deposit</h2>
        <Link href="/accounts/1/deposit">
          <button style={{ padding: "8px 16px" }}>
            Go to Deposit Page
          </button>
        </Link>
      </div>
    </main>
  );
}