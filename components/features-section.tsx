export function FeaturesSection() {
  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title reveal">What Arrives Each Month</h2>
        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="6" y="10" width="36" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M6 14 L24 28 L42 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="24" cy="8" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
              </svg>
            </div>
            <h3>A Sealed Letter</h3>
            <p>A multi-page letter written in-character from a figure in a sprawling fantasy world. Sealed with real wax, aged with care.</p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M24 4 L27 16 L40 12 L31 22 L42 30 L28 28 L24 42 L20 28 L6 30 L17 22 L8 12 L21 16 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <h3>World Artefacts</h3>
            <p>Pressed flowers, hand-drawn maps, coded messages, torn journal pages — pieces of the world that bleed through the envelope.</p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M24 6 C24 6 8 16 8 28 C8 36 15 42 24 42 C33 42 40 36 40 28 C40 16 24 6 24 6Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M24 18 L26 24 L32 24 L27 28 L29 34 L24 30 L19 34 L21 28 L16 24 L22 24 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
              </svg>
            </div>
            <h3>An Unfolding Story</h3>
            <p>Each letter continues a serialised narrative. Forbidden love, political intrigue, magic that demands a price. Your story builds month by month.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
