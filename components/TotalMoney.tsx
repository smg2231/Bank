"use client"; // client-side component

import { useEffect, useState } from "react";

export default function TotalMoney() {
  const [total, setTotal] = useState<number>(0); // total balance

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // fetch all accounts from API
        const res = await fetch(
          "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account"
        );

        if (!res.ok) {
          setTotal(0);
          return;
        }

        const accounts = await res.json();

        // calculate total balance
        const sum = accounts.reduce(
          (acc: number, account: any) =>
            acc + Number(account.balance || 0),
          0
        );

        setTotal(sum);
      } catch (err) {
        console.error(err);
        setTotal(0);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div style={{ fontSize: 20, marginTop: 5 }}>
      Total Money: ${total}
    </div>
  );
}