"use client";

import { useState } from "react";

export function WaitlistSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);

    // Simulate submission delay (replace with real API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store locally as fallback
    const waitlist = JSON.parse(localStorage.getItem("sis_waitlist") || "[]");
    waitlist.push({ name: name.trim(), email: email.trim(), date: new Date().toISOString() });
    localStorage.setItem("sis_waitlist", JSON.stringify(waitlist));

    setLoading(false);
    setSuccess(true);
  };

  return (
    <section className="waitlist" id="waitlist">
      <div className="container">
        <div className="waitlist-card reveal">
          <h2 className="section-title">The First Letters Are Coming</h2>
          <p className="waitlist-sub">Join the waitlist to be among the first to receive a letter when we launch. Early members get founding subscriber pricing.</p>

          {!success ? (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" className="spinner" style={{ display: "inline-block" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>
                ) : (
                  <span>Seal My Spot</span>
                )}
              </button>
              <p className="form-note">No spam. Just starlight.</p>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">&#10042;</div>
              <h3>You&apos;re on the list.</h3>
              <p>When the stars align, your first letter will find you.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
