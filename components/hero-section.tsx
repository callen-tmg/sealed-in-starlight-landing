"use client";

export function HeroSection() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#waitlist");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="seal-icon">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="36" stroke="url(#gold-gradient)" strokeWidth="1.5" fill="none" />
            <circle cx="40" cy="40" r="28" stroke="url(#gold-gradient)" strokeWidth="0.8" fill="none" opacity="0.5" />
            <path d="M40 18 L43 32 L56 28 L47 38 L58 46 L44 44 L40 58 L36 44 L22 46 L33 38 L24 28 L37 32 Z" fill="url(#gold-gradient)" opacity="0.9" />
            <circle cx="40" cy="40" r="6" fill="none" stroke="url(#gold-gradient)" strokeWidth="1" />
            <defs>
              <linearGradient id="gold-gradient" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stopColor="#c9a84c" />
                <stop offset="50%" stopColor="#f0d78c" />
                <stop offset="100%" stopColor="#c9a84c" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="pre-headline">A monthly letter subscription</p>
        <h1>Sealed in Starlight</h1>
        <p className="tagline">Handcrafted romantasy letters — sealed with wax, written by moonlight, delivered to your door.</p>
        <p className="sub-tagline">Each month, receive a letter from a world of fae courts, ancient bargains, and love that could shatter kingdoms.</p>
        <a href="#waitlist" className="cta-button" onClick={handleClick}>
          <span>Join the Waitlist</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
