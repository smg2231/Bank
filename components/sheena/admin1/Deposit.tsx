"use client"; 
import { useState } from "react"; 

import { useRouter } from "next/navigation"; 

export default function DepositBox({ accountId }: { accountId: string }) { 

  const [amount, setAmount] = useState(""); 

  const router = useRouter(); 
  const deposit = async () => { 
    await fetch(`/api/accounts/${accountId}/deposit`, { 
      method: "POST", 
      body: JSON.stringify({ amount }), 

    }); 
    router.push("/atm"); 
  }; 
  return ( 
    <div> 
      <input 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        placeholder="Amount" 
      /> 
      <button onClick={deposit}>Deposit</button> 
    </div> 
  ); 

} 