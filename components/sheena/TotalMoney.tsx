"use client";

import { useEffect, useState } from "react";

export default function TotalMoney() {
  const [total, setTotal] = useState(0);

  const fetchTotal = async () => {
    try {
      const res = await fetch("https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account", { cache: "no-store" });
      const accounts = await res.json();
      let sum = 0;
      for (let i = 0; i < accounts.length; i++) {
        sum += Number(accounts[i].balance || 0);
      }
      setTotal(sum);
    } catch {
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);

  return <div style={{ fontSize: 20, marginTop: 5 }}>Total Money: ${total}</div>;
}