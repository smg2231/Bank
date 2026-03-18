"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AccountPage() {
  const { id } = useParams(); //get account ID from URL params
  const [account, setAccount] = useState<any>(null); //store account data from API

  useEffect(() => {
    if (!id) return;

    const accountId = Array.isArray(id) ? id[0] : id;

    fetch(
      `https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account/${accountId}` //fetch account by ID
    )
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setAccount(data)) //save account data in state
      .catch(() => console.log("Fetch failed")); //handle fetch errors
  }, [id]);

  if (!account) return <p>Loading...</p>;

  return (
    <div>
      <h2>Account Page</h2>
      <p>ID: {account.id}</p>
      <p>Balance: {account.balance}</p>
    </div>
  );
}