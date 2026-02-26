export default async function TotalMoney() {
  const res = await fetch(
    "https://695f03af7f037703a8128fbf.mockapi.io/api/v1/Account",
    { cache: "no-store" }
  );

  const accounts = await res.json();

  const total = accounts.reduce(
    (sum:number, acc:any) => sum + Number(acc.balance || 0),
    0
  );

  return <div>${total.toLocaleString()}</div>;
}