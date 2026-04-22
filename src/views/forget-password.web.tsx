import { useState } from "react";
import {
  handleForgotPassword,
  validateEmail,
} from "../controllers/forget-password.controller.web";
import "../styles/auth.css";

interface ForgotPasswordPageProps {
  onOTPSent: (email: string) => void;
  onBack: () => void;
}

export function ForgotPasswordPage({
  onOTPSent,
  onBack,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [inputError, setInputError] = useState("");
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);
    setInputError("");

    setLoading(true);
    const result = await handleForgotPassword({ identifier: email, method });
    setLoading(false);

    if (result.success) {
      setAlert({ type: "success", message: result.message });
      setTimeout(() => onOTPSent(email), 1500); // we still pass identifier out as onOTPSent argument
    } else {
      setAlert({ type: "error", message: result.message });
      setInputError(result.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-panel auth-panel--form">
        <div className="form-card">
          <div className="form-logo">Freelance.dev</div>
          <h1 className="form-heading">Forgot password</h1>
          <p className="form-subheading">
            Enter your email and we'll send you an OTP to reset your password.
          </p>

          {alert && (
            <div className={`alert alert--${alert.type} visible`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <button 
                type="button" 
                onClick={() => setMethod("email")}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: method === "email" ? "2px solid var(--primary-color)" : "1px solid var(--border-color)", background: "transparent", cursor: "pointer" }}
              >
                Send to Email
              </button>
              <button 
                type="button" 
                onClick={() => setMethod("sms")}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: method === "sms" ? "2px solid var(--primary-color)" : "1px solid var(--border-color)", background: "transparent", cursor: "pointer" }}
              >
                Send via SMS
              </button>
            </div>

            <div className="field">
              <label htmlFor="identifier">{method === "email" ? "Email address" : "Phone number"}</label>
              <input
                id="identifier"
                name="identifier"
                type={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "you@example.com" : "(555) 555-5555"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInputError("");
                }}
                className={inputError ? "has-error" : ""}
                autoComplete={method === "email" ? "email" : "tel"}
              />
              {inputError && (
                <span className="field-error visible">{inputError}</span>
              )}
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <p className="form-footer">
            Remember your password? <a onClick={onBack}>Back to sign in</a>
          </p>
        </div>
      </div>

      <div className="auth-panel auth-panel--brand">
        <div className="brand-content">
          <h2 className="brand-tagline">
            Forgot your
            <br />
            <em>password?</em>
          </h2>
          <p className="brand-sub">
            No worries. We'll send a one-time code to your inbox and get you
            back in.
          </p>
        </div>
      </div>
    </div>
  );
}
