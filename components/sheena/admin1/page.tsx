import TotalMoney from "@/components/sheena/admin1/TotalMoney";
import Deposit from "./Deposit";

export default function Admin1Page() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Admin1</h1>
      <p>Welcome to the Admin1 landing page.</p>

      <article style={{ marginTop: 20, fontSize: 24 }}>
        <header>Total Money</header>
        <TotalMoney />
      </article>
      <article style={{ marginTop: 20, fontSize: 24 }}>
        <header>Deposit</header>
        <Deposit accountId="123456789" />
      </article>
    </main>
  );
}