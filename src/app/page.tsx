"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import DailyCosmicPortal from "@/components/DailyCosmicPortal";

// The source file opens with a brief storyboard/contact-sheet flash.
// Start on the first clean shot so those production frames are never shown.
const ABOUT_VIDEO_START_TIME = 0.25;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aboutVideoReady, setAboutVideoReady] = useState(false);
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
      video.currentTime = ABOUT_VIDEO_START_TIME;
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
          <a href="#careers" onClick={() => setMenuOpen(false)}>
            Careers
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

      <section className="intro" id="about">
        <div className="about-video-frame">
          <video
            ref={aboutVideoRef}
            className={aboutVideoReady ? "about-video ready" : "about-video"}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => {
              event.currentTarget.currentTime = ABOUT_VIDEO_START_TIME;
            }}
            onSeeked={() => setAboutVideoReady(true)}
            onEnded={restartAboutVideoAfterPause}
            aria-label="A message from MagJacky"
          >
            <source src="/about-magjacky.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="about-copy section">
          <p className="section-number">01 — ABOUT</p>
          <div className="about-copy-body">
            <h2>
              You already know more
              <br />
              than you think.
            </h2>
            <p>
              MagJacky blends ancient symbolic systems with compassionate,
              modern guidance—never fear, never absolutes, always centered on
              your agency.
            </p>
            <p>
              Come with a question. Leave with language for what you feel and a
              next step that is yours to choose.
            </p>
          </div>
        </div>
      </section>

      <section className="careers section" id="careers">
        <div className="careers-heading">
          <p className="section-number">02 — CAREERS</p>
          <h2>Meet this week’s top performer.</h2>
          <p>
            We believe the best teams make room for curiosity, kindness, and a
            well-timed break outside.
          </p>
        </div>
        <article className="employee-feature">
          <div className="employee-portrait">
            <Image
              src="/employee-of-the-week-corgi.png"
              alt="A tan Corgi and Jack Russell Terrier mix wearing a professional charcoal suit and gold tie"
              width={1024}
              height={1536}
              sizes="(max-width: 900px) 88vw, 42vw"
            />
          </div>
          <div className="employee-copy">
            <p className="employee-label">EMPLOYEE OF THE WEEK</p>
            <h3>Chief Morale Officer</h3>
            <p className="employee-breed">Tan Corgi × Jack Russell Terrier</p>
            <p>
              MagJacky’s resident office dog brings equal parts focus and
              enthusiasm to every workday. An expert in welcoming visitors,
              supervising snack quality, and recognizing exactly when the team
              needs a walk, this week’s honoree keeps the studio grounded,
              cheerful, and moving forward.
            </p>
            <p className="careers-note">
              Human opportunities will be posted here as the MagJacky team
              grows.
            </p>
          </div>
        </article>
      </section>

      <footer id="contact">
        <a className="brand" href="#top">
          MAGJACKY
        </a>
        <p>Intuition, made easier to hear.</p>
        <div className="footer-links" aria-label="Footer links coming soon">
          <span>Contact us</span>
          <span>Privacy</span>
          <a href="#careers">Careers</a>
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
