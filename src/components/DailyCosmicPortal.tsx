"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./DailyCosmicPortal.module.css";

const STORAGE_KEY = "magjacky-daily-sign";

const signs = [
  { name: "Aries", symbol: "♈", range: "Mar 21–Apr 19" },
  { name: "Taurus", symbol: "♉", range: "Apr 20–May 20" },
  { name: "Gemini", symbol: "♊", range: "May 21–Jun 20" },
  { name: "Cancer", symbol: "♋", range: "Jun 21–Jul 22" },
  { name: "Leo", symbol: "♌", range: "Jul 23–Aug 22" },
  { name: "Virgo", symbol: "♍", range: "Aug 23–Sep 22" },
  { name: "Libra", symbol: "♎", range: "Sep 23–Oct 22" },
  { name: "Scorpio", symbol: "♏", range: "Oct 23–Nov 21" },
  { name: "Sagittarius", symbol: "♐", range: "Nov 22–Dec 21" },
  { name: "Capricorn", symbol: "♑", range: "Dec 22–Jan 19" },
  { name: "Aquarius", symbol: "♒", range: "Jan 20–Feb 18" },
  { name: "Pisces", symbol: "♓", range: "Feb 19–Mar 20" },
] as const;

const themes = [
  {
    planet: "Mercury",
    symbol: "☿",
    focus: "Clear communication",
    message:
      "A conversation can become simpler when you say the essential thing first. Pause before responding and choose words that leave room for understanding.",
    affirmation: "My voice can be both honest and kind.",
    action: "Write the one sentence you most need to communicate today.",
    color: "Amber",
    number: 5,
  },
  {
    planet: "Venus",
    symbol: "♀",
    focus: "Connection and values",
    message:
      "Notice what feels nourishing rather than merely familiar. A small act of appreciation can soften the space between you and someone important.",
    affirmation: "I make room for connection without abandoning myself.",
    action: "Offer one specific, sincere thank-you.",
    color: "Rose",
    number: 6,
  },
  {
    planet: "Mars",
    symbol: "♂",
    focus: "Purposeful momentum",
    message:
      "Your energy is most useful when it has a clear direction. Choose one meaningful move instead of scattering effort across every open possibility.",
    affirmation: "I direct my energy with intention.",
    action: "Complete one task that takes less than twenty minutes.",
    color: "Crimson",
    number: 9,
  },
  {
    planet: "Jupiter",
    symbol: "♃",
    focus: "Perspective and growth",
    message:
      "A wider view may reveal an option you could not see from inside the problem. Curiosity will serve you better than pressure today.",
    affirmation: "I am allowed to grow beyond an old answer.",
    action: "Ask one thoughtful question before making a decision.",
    color: "Royal blue",
    number: 3,
  },
  {
    planet: "Saturn",
    symbol: "♄",
    focus: "Boundaries and structure",
    message:
      "A supportive limit can protect what matters most. Simplify one commitment so your time reflects your actual priorities.",
    affirmation: "My boundaries make space for what matters.",
    action: "Remove or reschedule one nonessential obligation.",
    color: "Charcoal",
    number: 8,
  },
  {
    planet: "Moon",
    symbol: "☾",
    focus: "Inner rhythm",
    message:
      "Your feelings contain information, not instructions. Give them a quiet moment to be heard before deciding what they mean for your next step.",
    affirmation: "I can listen inwardly without rushing to react.",
    action: "Take five screen-free minutes to name what you feel.",
    color: "Pearl",
    number: 2,
  },
  {
    planet: "Sun",
    symbol: "☉",
    focus: "Confidence and vitality",
    message:
      "Let your attention return to what makes you feel most like yourself. Quiet confidence grows when your choices match your values.",
    affirmation: "I let my truest priorities guide me.",
    action: "Give thirty focused minutes to something that energizes you.",
    color: "Gold",
    number: 1,
  },
] as const;

function localDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function seededNumber(dateKey: string, signIndex: number, salt: number) {
  const source = `${dateKey}:${signIndex}:${salt}`;
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function rating(dateKey: string, signIndex: number, salt: number) {
  return 3 + (seededNumber(dateKey, signIndex, salt) % 3);
}

function Rating({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.rating} aria-label={`${label}: ${value} out of 5`}>
      <span>{label}</span>
      <span className={styles.stars} aria-hidden="true">
        {"★".repeat(value)}
        {"☆".repeat(5 - value)}
      </span>
    </div>
  );
}

export default function DailyCosmicPortal() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dateKey, setDateKey] = useState("");

  useEffect(() => {
    const updateDate = () => setDateKey(localDateKey());
    const restoreTimer = window.setTimeout(() => {
      updateDate();

      const savedSign = window.localStorage.getItem(STORAGE_KEY);
      const savedIndex = savedSign === null ? Number.NaN : Number(savedSign);
      if (
        Number.isInteger(savedIndex) &&
        savedIndex >= 0 &&
        savedIndex < signs.length
      ) {
        setSelectedIndex(savedIndex);
      }
    }, 0);

    const timer = window.setInterval(updateDate, 60_000);
    return () => {
      window.clearTimeout(restoreTimer);
      window.clearInterval(timer);
    };
  }, []);

  const reading = useMemo(() => {
    if (selectedIndex === null || !dateKey) return null;

    const theme =
      themes[seededNumber(dateKey, selectedIndex, 1) % themes.length];
    return {
      sign: signs[selectedIndex],
      theme,
      energy: 62 + (seededNumber(dateKey, selectedIndex, 2) % 35),
      love: rating(dateKey, selectedIndex, 3),
      career: rating(dateKey, selectedIndex, 4),
      wellbeing: rating(dateKey, selectedIndex, 5),
      luckyNumber:
        1 + ((theme.number + seededNumber(dateKey, selectedIndex, 6)) % 22),
    };
  }, [dateKey, selectedIndex]);

  const formattedDate = dateKey
    ? new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(`${dateKey}T12:00:00`))
    : "";

  function selectSign(index: number) {
    setSelectedIndex(index);
    setDateKey(localDateKey());
    window.localStorage.setItem(STORAGE_KEY, String(index));
  }

  return (
    <section className={styles.portal} aria-labelledby="cosmic-portal-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>A MOMENT FOR YOU</p>
          <h2 id="cosmic-portal-title">Your Daily Cosmic Energy</h2>
          <p className={styles.intro}>
            Choose your sign for a fresh reading every day at midnight.
          </p>
        </header>

        <div className={styles.signGrid} aria-label="Choose your zodiac sign">
          {signs.map((sign, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                className={`${styles.signButton} ${isSelected ? styles.selected : ""}`}
                key={sign.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectSign(index)}
              >
                <span className={styles.signSymbol} aria-hidden="true">
                  {sign.symbol}
                </span>
                <span className={styles.signName}>{sign.name}</span>
                <span className={styles.signRange}>{sign.range}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.readingRegion} aria-live="polite">
          {!reading ? (
            <div className={styles.emptyState}>
              <span aria-hidden="true">✦</span>
              <p>
                Your reading appears here—no account, email, or personal
                information required.
              </p>
            </div>
          ) : (
            <article
              className={styles.readingCard}
              key={`${dateKey}-${selectedIndex}`}
            >
              <header className={styles.readingHeader}>
                <div className={styles.identity}>
                  <span className={styles.readingSymbol} aria-hidden="true">
                    {reading.sign.symbol}
                  </span>
                  <div>
                    <p>{formattedDate}</p>
                    <h3>{reading.sign.name}</h3>
                  </div>
                </div>
                <div className={styles.energy}>
                  <strong>{reading.energy}%</strong>
                  <span>Overall cosmic energy</span>
                </div>
              </header>

              <div className={styles.influence}>
                <span className={styles.planetSymbol} aria-hidden="true">
                  {reading.theme.symbol}
                </span>
                <div>
                  <p>Today’s planetary influence</p>
                  <h4>{reading.theme.planet}</h4>
                  <span>{reading.theme.focus}</span>
                </div>
              </div>

              <p className={styles.message}>{reading.theme.message}</p>

              <div className={styles.ratings}>
                <Rating label="Love" value={reading.love} />
                <Rating label="Career" value={reading.career} />
                <Rating label="Wellbeing" value={reading.wellbeing} />
              </div>

              <div className={styles.guidanceGrid}>
                <div className={styles.guidance}>
                  <p>Daily affirmation</p>
                  <blockquote>“{reading.theme.affirmation}”</blockquote>
                </div>
                <div className={styles.action}>
                  <p>One practical action</p>
                  <strong>{reading.theme.action}</strong>
                </div>
              </div>

              <div className={styles.readingFooter}>
                <div className={styles.luckyDetails}>
                  <span>
                    Lucky number <strong>{reading.luckyNumber}</strong>
                  </span>
                  <span>
                    Lucky color <strong>{reading.theme.color}</strong>
                  </span>
                </div>
                <a href="#about">
                  Learn more about MagJacky <span aria-hidden="true">↓</span>
                </a>
              </div>

              <p className={styles.returnCue}>
                Come back tomorrow for a new reading.
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
