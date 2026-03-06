"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Sign in failed");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="landing-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(107, 29, 58, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(45, 90, 61, 0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div className="waitlist-card" style={{ opacity: 1, transform: "none", maxWidth: 420, width: "100%", margin: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 32, color: "var(--gold)", marginBottom: 16 }}>&#10042;</div>
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: 24,
              fontWeight: 400,
              letterSpacing: 2,
              color: "var(--text-primary)",
              marginBottom: 8,
            }}
          >
            Welcome Back
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", fontStyle: "italic", marginBottom: 32 }}>
            Enter the starlight.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="waitlist-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <svg width="20" height="20" viewBox="0 0 24 24" className="spinner" style={{ display: "inline-block" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
              </svg>
            ) : (
              <span>Sign In</span>
            )}
          </button>
          {error && (
            <p style={{ color: "#e87777", fontSize: "0.9rem", textAlign: "center", marginTop: 4 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
