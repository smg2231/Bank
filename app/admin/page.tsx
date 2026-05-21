"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TotalMoney from "@/components/TotalMoney";
import TellerFunc from "@/components/TellerFunc";
import History from "@/components/History";
import "../../styles/admin.css";
import {
  Banknote,
  ArrowDownToLine,
  Send,
  History as HistoryIcon,
  LogOut,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  // stores logged-in admin ID
  const [loggedInUserId, setLoggedInUserId] = useState("");
  // controls which section is shown (deposit, withdraw, etc.)
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  // loading state while checking authentication
  const [loading, setLoading] = useState(true);
  // check user auth + role on page load
  useEffect(() => {
    const userId = localStorage.getItem("loggedInUserId");
    const role = localStorage.getItem("loggedInRole");
    const isAdmin = role?.trim().toLowerCase() === "admin";
    // redirect if not logged in
    if (!userId) {
      router.replace("/");
      return;
    }
    // redirect if not admin
    if (!isAdmin) {
      router.replace("/user");
      return;
    }
    // valid admin user
    setLoggedInUserId(userId);
    setLoading(false);
  }, [router]);
  // clears session and logs user out
  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };
  // sidebar action buttons
  const actions = [
    { title: "Deposit", type: "deposit", icon: Banknote },
    { title: "Withdraw", type: "withdraw", icon: ArrowDownToLine },
    { title: "Transfer", type: "transfer", icon: Send },
    { title: "History", type: "history", icon: HistoryIcon },
    { title: "Logout", type: "logout", icon: LogOut },
  ];
  // show nothing while checking auth
  if (loading) return null;
  return (
    <main className="admin-container">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <h2>Actions</h2>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.type}
              onClick={
                action.type === "logout"
                  ? handleLogout
                  : () => setActiveComponent(action.type)
              }
              className="admin-button"
            >
              <Icon size={18} />
              {action.title}
            </button>
          );
        })}
        {/* displays total money overview */}
        <div className="total-money">
          <TotalMoney />
        </div>
      </aside>
      {/* Main content area */}
      <section className="admin-content">
        <h1>Admin Dashboard</h1>
        {/* default state */}
        {!activeComponent && <p>Select an action</p>}
        {/* conditional rendering based on selected action */}
        {activeComponent === "deposit" && <TellerFunc type="deposit" />}
        {activeComponent === "withdraw" && <TellerFunc type="withdraw" />}
        {activeComponent === "transfer" && <TellerFunc type="transfer" />}
        {activeComponent === "history" && <History />}
      </section>
    </main>
  );
}