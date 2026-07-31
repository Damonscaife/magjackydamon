"use client";

import { FormEvent, useState } from "react";

const services = [
  {
    symbol: "☾",
    title: "Intuitive Tarot",
    text: "A grounded reading for the question that keeps circling back.",
  },
  {
    symbol: "✦",
    title: "Astrology Insight",
    text: "Understand the patterns, timing, and invitations written in your chart.",
  },
  {
    symbol: "◐",
    title: "AI + Human Readings",
    text: "Thoughtful technology guided by human intuition, context, and care.",
  },
];

const faqs = [
  [
    "What can I ask about?",
    "Bring a relationship, career decision, creative block, transition, or any question that needs a clearer perspective.",
  ],
  [
    "Do I need to know tarot or astrology?",
    "Not at all. Every reading is explained in warm, everyday language and centered on your real life.",
  ],
  [
    "Is this fortune-telling?",
    "MagJacky is about reflection and possibility—not fixed predictions. You always remain the author of your choices.",
  ],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

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
          <a href="#readings" onClick={() => setMenuOpen(false)}>
            Readings
          </a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>
            FAQ
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

      <section className="intro section" id="about">
        <p className="section-number">01 — ABOUT</p>
        <div>
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

      <section className="readings section" id="readings">
        <div className="section-heading">
          <p className="section-number">02 — READINGS</p>
          <h2>Choose your doorway.</h2>
          <p>Every path begins with one honest question.</p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.title}>
              <span className="card-index">0{index + 1}</span>
              <div className="card-symbol" aria-hidden="true">
                {service.symbol}
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <button onClick={() => setModalOpen(true)}>
                Explore this reading <span>↗</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="sample section">
        <div className="sample-copy">
          <p className="section-number">A THREE-CARD MOMENT</p>
          <h2>
            Past. Present.
            <br />
            <em>Possibility.</em>
          </h2>
          <p>
            A simple spread can shift the light. Tap a card to imagine what
            might be waiting beneath it.
          </p>
          <button className="primary" onClick={() => setModalOpen(true)}>
            Draw your cards <span>→</span>
          </button>
        </div>
        <div className="tarot-stack" aria-label="Three decorative tarot cards">
          {["THE ROOT", "THE MIRROR", "THE OPENING"].map((label, index) => (
            <button
              key={label}
              className={`tarot-card card-${index + 1}`}
              onClick={() => setModalOpen(true)}
            >
              <span>✦</span>
              <b>{label}</b>
              <small>MAGJACKY</small>
            </button>
          ))}
        </div>
      </section>

      <section className="testimonial section">
        <span className="quote-mark">“</span>
        <blockquote>
          I didn’t need someone to tell me what would happen. I needed help
          recognizing what I already knew. That is exactly what this gave me.
        </blockquote>
        <p>— A MAGJACKY READER</p>
      </section>

      <section className="faq section" id="faq">
        <div>
          <p className="section-number">03 — QUESTIONS</p>
          <h2>
            A little more
            <br />
            light on things.
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="newsletter section">
        <div>
          <p className="eyebrow">NOTES FROM THE IN-BETWEEN</p>
          <h2>
            A thoughtful message,
            <br />
            when the timing is right.
          </h2>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setEmail("");
          }}
        >
          <label className="sr-only" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
          />
          <button aria-label="Subscribe">→</button>
        </form>
      </section>

      <footer>
        <a className="brand" href="#top">
          MAGJACKY
        </a>
        <p>Intuition, made easier to hear.</p>
        <div>
          <a href="#about">About</a>
          <a href="#readings">Readings</a>
          <a href="#faq">FAQ</a>
        </div>
        <small>© 2026 MagJacky. For reflection and entertainment.</small>
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
