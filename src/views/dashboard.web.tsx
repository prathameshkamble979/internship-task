import { useEffect, useState } from "react";
import { getActiveUser, setActiveSession, User } from "../controllers/storage.controller";
import "../styles/auth.css"; // We'll reuse some auth styles or add custom ones

interface DashboardProps {
  onLogout: () => void;
}

export function DashboardPage({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for active session when dashboard mounts
    const active = getActiveUser();
    if (!active) {
      // If no active user, kick back to login
      onLogout();
    } else {
      setUser(active);
    }
  }, [onLogout]);

  if (!user) return null; // Or a loading spinner

  function handleLogout() {
    setActiveSession(null);
    onLogout();
  }

  return (
    <div className="auth-wrapper" style={{ alignItems: "flex-start", padding: "2rem" }}>
      <div className="auth-panel" style={{ width: "100%", maxWidth: "1200px", background: "transparent", boxShadow: "none", flexDirection: "row", gap: "2rem" }}>
        
        {/* Sidebar */}
        <aside style={{ flex: "0 0 250px", background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <div className="form-logo" style={{ marginBottom: "2rem" }}>Freelance.dev</div>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>Logged in as</p>
            <h3 style={{ margin: "0.25rem 0 0", color: "var(--text-primary)" }}>{user.name}</h3>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>{user.email}</p>
          </div>
          
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button className="btn-primary" style={{ padding: "0.75rem", marginBottom: "1rem" }}>
              + New Project
            </button>
            <a href="#" style={{ padding: "0.5rem", color: "var(--primary-color)", fontWeight: "500", textDecoration: "none" }}>Dashboard</a>
            <a href="#" style={{ padding: "0.5rem", color: "var(--text-secondary)", textDecoration: "none" }}>Projects</a>
            <a href="#" style={{ padding: "0.5rem", color: "var(--text-secondary)", textDecoration: "none" }}>Invoices</a>
            <a href="#" style={{ padding: "0.5rem", color: "var(--text-secondary)", textDecoration: "none" }}>Messages</a>
          </nav>

          <button 
            onClick={handleLogout}
            style={{ marginTop: "auto", background: "transparent", border: "1px solid var(--border-color)", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", position: "absolute", bottom: "2rem" }}
          >
            Sign out
          </button>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <header>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "var(--text-primary)" }}>Client Portal</h1>
            <p style={{ margin: "0.5rem 0 0", color: "var(--text-secondary)" }}>Here's what's happening with your projects.</p>
          </header>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Active Projects</p>
              <h2 style={{ margin: "0.5rem 0 0", fontSize: "1.75rem" }}>1</h2>
            </div>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Pending Invoices</p>
              <h2 style={{ margin: "0.5rem 0 0", fontSize: "1.75rem" }}>₹0.00</h2>
            </div>
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem" }}>Unread Messages</p>
              <h2 style={{ margin: "0.5rem 0 0", fontSize: "1.75rem" }}>2</h2>
            </div>
          </div>

          {/* Active Project Tracker */}
          <section style={{ background: "white", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <h3 style={{ margin: "0 0 1.5rem" }}>Current Project</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "1.1rem" }}>E-Commerce Store Redesign</h4>
                <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.875rem" }}>Due: Nov 15th, 2026</p>
              </div>
              <span style={{ background: "var(--bg-color)", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.875rem", fontWeight: "500" }}>75% Complete</span>
            </div>
            
            {/* Progress Bar */}
            <div style={{ width: "100%", height: "8px", background: "var(--bg-color)", borderRadius: "4px", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ width: "75%", height: "100%", background: "var(--primary-color)", borderRadius: "4px" }}></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--primary-color)" }}></div>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>Frontend Development <span style={{ color: "var(--text-secondary)" }}>(In Progress)</span></p>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--success-color, #10b981)" }}></div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Wireframes Approved</p>
              </div>
            </div>
          </section>

          {/* Recent Invoices */}
          <section style={{ background: "white", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
            <h3 style={{ margin: "0 0 1.5rem" }}>Recent Invoices</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: "500" }}>Invoice Number</th>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: "500" }}>Date</th>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: "500" }}>Amount</th>
                  <th style={{ paddingBottom: "0.75rem", fontWeight: "500" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "1rem 0" }}>INV-1043</td>
                  <td style={{ padding: "1rem 0", color: "var(--text-secondary)" }}>Oct 20, 2026</td>
                  <td style={{ padding: "1rem 0", fontWeight: "500" }}>₹20,500</td>
                  <td style={{ padding: "1rem 0" }}><span style={{ background: "#fef3c7", color: "#92400e", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>PENDING</span></td>
                </tr>
                <tr>
                  <td style={{ padding: "1rem 0" }}>INV-1042</td>
                  <td style={{ padding: "1rem 0", color: "var(--text-secondary)" }}>Oct 01, 2026</td>
                  <td style={{ padding: "1rem 0", fontWeight: "500" }}>₹41,000</td>
                  <td style={{ padding: "1rem 0" }}><span style={{ background: "#d1fae5", color: "#065f46", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>PAID</span></td>
                </tr>
              </tbody>
            </table>
          </section>
          
        </main>
      </div>
    </div>
  );
}
