"use client";

import { useState } from "react";
import TotalMoney from "@/components/sheena/TotalMoney";
import DepositBox from "@/components/sheena/Deposit";

export default function Admin1Page() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDeposit = () => {
    setRefreshKey(prev => prev + 1);
  };

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
        <DepositBox accountId="1" onDeposit={handleDeposit} />
      </div>
    </main>
  );
}