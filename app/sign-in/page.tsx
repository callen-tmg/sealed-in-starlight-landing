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
    <div style={{ maxWidth: 400, margin: "100px auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem", textAlign: "center" }}>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.75rem", border: "1px solid #333", borderRadius: 4, background: "#111", color: "#eee" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.75rem", border: "1px solid #333", borderRadius: 4, background: "#111", color: "#eee" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.75rem", background: "#c9a84c", color: "#0a0a12", border: "none", borderRadius: 4, fontWeight: 600, cursor: "pointer" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <p style={{ color: "#e87777", fontSize: "0.9rem" }}>{error}</p>}
      </form>
    </div>
  );
}
