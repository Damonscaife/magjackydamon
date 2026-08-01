"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import DailyCosmicPortal from "@/components/DailyCosmicPortal";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const aboutVideoRef = useRef<HTMLVideoElement>(null);
  const aboutRestartTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (aboutRestartTimeout.current !== null) {
        window.clearTimeout(aboutRestartTimeout.current);
      }
    };
  }, []);

  function restartAboutVideoAfterPause() {
    const video = aboutVideoRef.current;

    if (!video) return;

    aboutRestartTimeout.current = window.setTimeout(() => {
      video.currentTime = 0;
      void video.play();
    }, 2000);
  }

  function submitReading(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="MagJacky home">
          MAGJACKY
        </a>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          {menuOpen ? "×" : "☰"}
        </button>
        <nav
          className={menuOpen ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#daily-reading" onClick={() => setMenuOpen(false)}>
            Daily reading
          </a>
          <button className="nav-cta" onClick={() => setModalOpen(true)}>
            Begin a reading
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero-tarot.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="stars" aria-hidden="true">
          ✦　·　✧　　·　✦　·　　✧
        </div>
        <p className="eyebrow">INTUITIVE GUIDANCE FOR MODERN LIFE</p>
        <h1>
          Clarity for the
          <br />
          <em>path ahead.</em>
        </h1>
        <p className="hero-copy">
          Tarot, astrology, and thoughtful AI come together to help you hear
          what your intuition has been saying all along.
        </p>
        <div className="hero-actions">
          <button className="primary" onClick={() => setModalOpen(true)}>
            Begin your reading <span>→</span>
          </button>
          <a className="text-link" href="#about">
            Discover MagJacky ↓
          </a>
        </div>
      </section>

      <div id="daily-reading">
        <DailyCosmicPortal />
      </div>

      <section className="intro section" id="about">
        <p className="section-number">01 — ABOUT</p>
        <div className="about-content">
          <div className="about-video-frame">
            <video
              ref={aboutVideoRef}
              className="about-video"
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={restartAboutVideoAfterPause}
              aria-label="A message from MagJacky"
            >
              <source src="/about-magjacky.mp4" type="video/mp4" />
            </video>
          </div>
          <h2>
            You already know more
            <br />
            than you think.
          </h2>
          <p>
            MagJacky creates a quiet place to listen. Our readings blend ancient
            symbolic systems with compassionate, modern guidance—never fear,
            never absolutes, always centered on your agency.
          </p>
          <p>
            Come with a question. Leave with language for what you feel and a
            next step that is yours to choose.
          </p>
        </div>
      </section>

      <footer id="contact">
        <a className="brand" href="#top">
          MAGJACKY
        </a>
        <p>Intuition, made easier to hear.</p>
        <div className="footer-links" aria-label="Footer links coming soon">
          <span>Contact us</span>
          <span>Privacy</span>
          <span>Careers</span>
          <span>Terms</span>
          <span>Accessibility</span>
        </div>
        <small className="footer-note">
          © 2026 MagJacky. For reflection and entertainment.
        </small>
      </footer>

      {modalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setModalOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reading-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            {submitted ? (
              <div className="success">
                <span>✦</span>
                <h2>Your question is received.</h2>
                <p>
                  This is the beginning of a more thoughtful reading experience.
                  We’ll be ready to continue soon.
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    setModalOpen(false);
                    setSubmitted(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow">BEGIN A READING</p>
                <h2 id="reading-title">What’s asking for your attention?</h2>
                <p>
                  Share the question you’re sitting with. Keep it as simple or
                  detailed as you like.
                </p>
                <form onSubmit={submitReading}>
                  <label htmlFor="name">Your name</label>
                  <input id="name" required placeholder="First name" />
                  <label htmlFor="question">Your question</label>
                  <textarea
                    id="question"
                    required
                    rows={4}
                    placeholder="I’m looking for clarity about…"
                  />
                  <button className="primary" type="submit">
                    Continue <span>→</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
